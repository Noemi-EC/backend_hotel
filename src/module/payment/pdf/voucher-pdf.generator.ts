import * as PDFDocument from 'pdfkit';

export interface VoucherPdfData {
  confirmationCode: string;
  hotel: { name: string; address: string; phone?: string };
  room: { code: string; category: string; price: number };
  book: {
    id: number;
    checkInDate: string | Date;
    checkOutDate: string | Date;
    price: number;
  };
  customer: { name: string; lastName: string; email: string; dni: string };
  payment: { amount: number; cardLastDigits: string; date: string | Date };
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function nightsBetween(
  checkIn: string | Date,
  checkOut: string | Date,
): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function generateVoucherPdf(data: VoucherPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: unknown) => chunks.push(chunk as Buffer));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const nights = nightsBetween(data.book.checkInDate, data.book.checkOutDate);

    // ── Header ──
    doc
      .fontSize(20)
      .fillColor('#3f51b5')
      .text(data.hotel.name, { align: 'left' })
      .fontSize(10)
      .fillColor('#555')
      .text(data.hotel.address)
      .moveDown(1.5);

    doc
      .fontSize(16)
      .fillColor('#000')
      .text('Comprobante de Reserva', { align: 'left' })
      .moveDown(0.3);

    const boxX = doc.x;
    const boxY = doc.y;
    const boxWidth = 260;
    const boxHeight = 30;

    doc
      .roundedRect(boxX, boxY, boxWidth, boxHeight, 4)
      .fillAndStroke('#eef0fc', '#3f51b5');

    doc
      .fillColor('#3f51b5')
      .fontSize(12)
      .text(`Código: ${data.confirmationCode}`, boxX + 12, boxY + 9, {
        width: boxWidth - 24,
        lineBreak: false,
      });

    // Reposicionar el cursor debajo del recuadro para el resto del contenido
    doc.x = boxX;
    doc.y = boxY + boxHeight + 15;

    // ── Datos del cliente ──
    doc
      .fillColor('#000')
      .fontSize(13)
      .text('Datos del cliente', { underline: true });
    doc.moveDown(0.4);
    doc
      .fontSize(10)
      .fillColor('#333')
      .text(`Nombre: ${data.customer.name} ${data.customer.lastName}`)
      .text(`DNI: ${data.customer.dni}`)
      .text(`Email: ${data.customer.email}`);

    doc.moveDown(1.2);

    // ── Datos de la reserva ──
    doc
      .fillColor('#000')
      .fontSize(13)
      .text('Detalle de la reserva', { underline: true });
    doc.moveDown(0.4);
    doc
      .fontSize(10)
      .fillColor('#333')
      .text(`Habitación: ${data.room.code} (${data.room.category})`)
      .text(`Check-in: ${formatDate(data.book.checkInDate)}`)
      .text(`Check-out: ${formatDate(data.book.checkOutDate)}`)
      .text(`Noches: ${nights}`)
      .text(`Precio por noche: S/ ${Number(data.room.price).toFixed(2)}`);

    doc.moveDown(1.2);

    // ── Datos del pago ──
    doc
      .fillColor('#000')
      .fontSize(13)
      .text('Detalle del pago', { underline: true });
    doc.moveDown(0.4);
    doc
      .fontSize(10)
      .fillColor('#333')
      .text(`Fecha de pago: ${formatDate(data.payment.date)}`)
      .text(`Tarjeta: **** **** **** ${data.payment.cardLastDigits}`)
      .text(`Estado: Pagado`);

    doc.moveDown(0.8);

    doc
      .fontSize(14)
      .fillColor('#3f51b5')
      .text(`Total pagado: S/ ${Number(data.payment.amount).toFixed(2)}`, {
        align: 'right',
      });

    doc.moveDown(2);

    // ── Footer ──
    doc
      .fontSize(9)
      .fillColor('#999')
      .text(
        'Este comprobante es una constancia de pago generada automáticamente.',
        {
          align: 'center',
        },
      )
      .text(`Generado el ${formatDate(new Date())}`, { align: 'center' });

    doc.end();
  });
}
