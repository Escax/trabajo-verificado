package com.trabajoverificado.backend.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.trabajoverificado.backend.config.Avisos;
import com.trabajoverificado.backend.dto.EstadisticasResponse;
import com.trabajoverificado.backend.entity.EstadoVerificacion;
import com.trabajoverificado.backend.entity.Trabajo;
import com.trabajoverificado.backend.entity.Usuario;
import com.trabajoverificado.backend.entity.Verificacion;
import com.trabajoverificado.backend.repository.UsuarioRepository;
import com.trabajoverificado.backend.repository.VerificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ReporteService {
    private final UsuarioRepository usuarioRepo;
    private final VerificacionRepository verificacionRepo;
    private final HistorialService historialService;

    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final NumberFormat PESOS = NumberFormat.getCurrencyInstance(Locale.of("es", "CO"));
    static { PESOS.setMaximumFractionDigits(0); }

    private static final Font TITULO = new Font(Font.HELVETICA, 18, Font.BOLD);
    private static final Font NEGRITA = new Font(Font.HELVETICA, 10, Font.BOLD);
    private static final Font NORMAL = new Font(Font.HELVETICA, 10);
    private static final Font AVISO = new Font(Font.HELVETICA, 9, Font.ITALIC, Color.DARK_GRAY);

    @Transactional(readOnly = true)
    public byte[] generar(Long userId) {
        Usuario u = usuarioRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        EstadisticasResponse e = historialService.estadisticas(userId);
        List<Verificacion> confirmadas = verificacionRepo
                .findByTrabajoTrabajadorIdAndEstadoOrderByTrabajoFechaDesc(userId, EstadoVerificacion.CONFIRMADA);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.LETTER, 40, 40, 40, 40);
        PdfWriter.getInstance(doc, out);
        doc.open();

        // Encabezado
        doc.add(new Paragraph("Historial de trabajos verificados", TITULO));
        doc.add(new Paragraph(u.getNombre() + " · " + nvl(u.getOficio()) + " · " + nvl(u.getCiudad()), NORMAL));
        doc.add(new Paragraph("Generado el " + LocalDate.now().format(FECHA), NORMAL));

        // Aviso destacado
        PdfPTable aviso = new PdfPTable(1);
        aviso.setWidthPercentage(100);
        aviso.setSpacingBefore(12);
        PdfPCell celdaAviso = new PdfPCell(new Phrase(Avisos.NO_CERTIFICA, AVISO));
        celdaAviso.setBackgroundColor(new Color(255, 243, 205));
        celdaAviso.setPadding(8);
        aviso.addCell(celdaAviso);
        doc.add(aviso);

        // Resumen
        Paragraph tituloResumen = new Paragraph("Resumen", NEGRITA);
        tituloResumen.setSpacingBefore(14);
        doc.add(tituloResumen);
        PdfPTable resumen = new PdfPTable(2);
        resumen.setWidthPercentage(60);
        resumen.setHorizontalAlignment(Element.ALIGN_LEFT);
        resumen.setSpacingBefore(6);
        fila(resumen, "Trabajos registrados", String.valueOf(e.trabajosRegistrados()));
        fila(resumen, "Trabajos verificados", String.valueOf(e.trabajosVerificados()));
        fila(resumen, "Clientes distintos", String.valueOf(e.clientesDistintos()));
        fila(resumen, "Meses con actividad", String.valueOf(e.mesesActividad()));
        fila(resumen, "Monto total verificado", PESOS.format(e.montoTotalVerificado()));
        doc.add(resumen);

        // Detalle
        Paragraph tituloDetalle = new Paragraph("Trabajos verificados", NEGRITA);
        tituloDetalle.setSpacingBefore(14);
        doc.add(tituloDetalle);

        if (confirmadas.isEmpty()) {
            doc.add(new Paragraph("Aún no hay trabajos verificados.", NORMAL));
        } else {
            PdfPTable tabla = new PdfPTable(new float[]{2, 3, 4, 2.5f, 2});
            tabla.setWidthPercentage(100);
            tabla.setSpacingBefore(6);
            tabla.setHeaderRows(1);   // repite el encabezado si la tabla pasa de página
            for (String h : List.of("Fecha", "Cliente", "Servicio", "Valor", "Confirmado")) {
                PdfPCell c = new PdfPCell(new Phrase(h, NEGRITA));
                c.setBackgroundColor(new Color(230, 230, 230));
                c.setPadding(5);
                tabla.addCell(c);
            }
            for (Verificacion v : confirmadas) {
                Trabajo t = v.getTrabajo();
                celda(tabla, t.getFecha().format(FECHA));
                celda(tabla, t.getNombreCliente());
                celda(tabla, t.getServicio());
                celda(tabla, PESOS.format(t.getValor()));
                celda(tabla, v.getFechaRespuesta().toLocalDate().format(FECHA));
            }
            doc.add(tabla);
        }

        doc.close();
        return out.toByteArray();
    }

    private void fila(PdfPTable t, String etiqueta, String valor) {
        celda(t, etiqueta);
        PdfPCell c = new PdfPCell(new Phrase(valor, NEGRITA));
        c.setPadding(5);
        t.addCell(c);
    }

    private void celda(PdfPTable t, String texto) {
        PdfPCell c = new PdfPCell(new Phrase(texto, NORMAL));
        c.setPadding(5);
        t.addCell(c);
    }

    private String nvl(String s) {
        return (s == null || s.isBlank()) ? "—" : s;
    }
}