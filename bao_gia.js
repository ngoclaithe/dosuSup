const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
    VerticalAlign, HeadingLevel } = require('docx');
const fs = require('fs');

const BLUE = "1B4F9C";
const LIGHT_BLUE = "EEF4FB";
const MID_BLUE = "D6E4F5";
const DARK = "1A1A2E";
const GRAY = "555555";
const WHITE = "FFFFFF";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const PAGE_W = 9026; // A4 content width 1" margins

function cell(text, opts = {}) {
    const { bold = false, color = DARK, fill = WHITE, align = AlignmentType.LEFT, size = 19, italic = false, colspan } = opts;
    return new TableCell({
        borders,
        width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
        columnSpan: colspan,
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 90, bottom: 90, left: 130, right: 130 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
            alignment: align,
            children: [new TextRun({ text, bold, color, size, italics: italic, font: "Arial" })]
        })]
    });
}

function heading(text, level = 1) {
    const sizes = { 1: 28, 2: 24 };
    return new Paragraph({
        spacing: { before: 280, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 1 } },
        children: [new TextRun({ text, bold: true, color: BLUE, size: sizes[level] || 22, font: "Arial" })]
    });
}

function para(text, opts = {}) {
    const { bold = false, color = DARK, size = 19, before = 80, after = 80, align = AlignmentType.LEFT } = opts;
    return new Paragraph({
        spacing: { before, after },
        alignment: align,
        children: [new TextRun({ text, bold, color, size, font: "Arial" })]
    });
}

function tableHeader(cols) {
    return new TableRow({
        tableHeader: true,
        children: cols.map(c => new TableCell({
            borders,
            width: c.width ? { size: c.width, type: WidthType.DXA } : undefined,
            shading: { fill: BLUE, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 130, right: 130 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: c.text, bold: true, color: WHITE, size: 19, font: "Arial" })]
            })]
        }))
    });
}

function row(cells, shade = false) {
    return new TableRow({
        children: cells.map((c, i) => new TableCell({
            borders,
            width: c.width ? { size: c.width, type: WidthType.DXA } : undefined,
            columnSpan: c.colspan,
            shading: { fill: shade ? LIGHT_BLUE : WHITE, type: ShadingType.CLEAR },
            margins: { top: 90, bottom: 90, left: 130, right: 130 },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
                alignment: c.align || AlignmentType.LEFT,
                children: [new TextRun({ text: c.text, bold: c.bold || false, color: c.color || DARK, size: c.size || 19, font: "Arial" })]
            })]
        }))
    });
}

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 19 } } }
    },
    numbering: {
        config: [
            {
                reference: "bullets", levels: [{
                    level: 0, format: LevelFormat.BULLET, text: "•",
                    alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: { before: 60, after: 60 } } }
                }]
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                size: { width: 11906, height: 16838 },
                margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
            }
        },
        children: [

            // ===== COVER BANNER =====
            new Table({
                width: { size: PAGE_W, type: WidthType.DXA },
                columnWidths: [PAGE_W],
                rows: [new TableRow({
                    children: [new TableCell({
                        borders: noBorders,
                        shading: { fill: BLUE, type: ShadingType.CLEAR },
                        margins: { top: 320, bottom: 280, left: 400, right: 400 },
                        children: [
                            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "BÁO GIÁ DỊCH VỤ THIẾT KẾ WEBSITE", bold: true, color: WHITE, size: 34, font: "Arial" })] }),
                            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: "Website Thực Phẩm Chức Năng & Quản Trị Hệ Thống", color: "BDD7EE", size: 22, font: "Arial" })] }),
                            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [new TextRun({ text: `Ngày lập: 08/05/2026  │  Hiệu lực báo giá: 15 ngày`, color: "E0ECF8", size: 18, font: "Arial" })] }),
                        ]
                    })]
                })]
            }),

            para(""),

            // ===== KÍNH GỬI =====
            new Paragraph({
                spacing: { before: 120, after: 80 }, children: [
                    new TextRun({ text: "Kính gửi: ", bold: true, size: 20, font: "Arial" }),
                    new TextRun({ text: "Ông Doãn Minh Quang", size: 20, font: "Arial" })
                ]
            }),
            para("Chúng tôi trân trọng gửi đề xuất thiết kế website bán thực phẩm chức năng chuyên nghiệp — giao diện tối ưu, thân thiện với người dùng, tích hợp đầy đủ tính năng bán hàng và quản trị đơn hàng, giúp tối ưu hóa quy trình kinh doanh và tăng cường trải nghiệm mua sắm của khách hàng.", { size: 19, color: GRAY }),

            para(""),

            // ===== INFO TABLE =====
            new Table({
                width: { size: PAGE_W, type: WidthType.DXA },
                columnWidths: [2800, PAGE_W - 2800],
                rows: [
                    row([{ text: "Hình thức thanh toán", bold: true, width: 2800 }, { text: "Chuyển khoản ngân hàng — Xuất hóa đơn VAT đầy đủ" }], true),
                    row([{ text: "Thời gian thực hiện", bold: true, width: 2800 }, { text: "~2 tuần (14 ngày làm việc)" }], false),
                    row([{ text: "Nền tảng", bold: true, width: 2800 }, { text: "Website responsive (Next.js, React, Tailwind CSS, Prisma) — tối ưu Desktop & Mobile" }], true),
                    row([{ text: "Bảo hành", bold: true, width: 2800 }, { text: "3 tháng sau bàn giao (lỗi phát sinh do lập trình, không thu phí)" }], false),
                ]
            }),

            para(""),

            // ===== 1. TỔNG QUAN =====
            heading("1. TỔNG QUAN WEBSITE"),
            para("Website được thiết kế theo tiêu chí Chuyên nghiệp – Hiện đại – Tối ưu chuyển đổi, phù hợp với lĩnh vực kinh doanh thực phẩm chức năng. Hệ thống bao gồm giao diện người dùng (khách mua hàng) và trang quản trị (Admin) để quản lý sản phẩm, đơn hàng, và nội dung.", { color: GRAY }),

            new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: "Các module chính:", bold: true, size: 19, font: "Arial" })] }),
            new Table({
                width: { size: PAGE_W, type: WidthType.DXA },
                columnWidths: [1800, PAGE_W - 1800],
                rows: [
                    tableHeader([{ text: "Module", width: 1800 }, { text: "Nội dung" }]),
                    row([{ text: "Trang chủ", bold: true, width: 1800 }, { text: "Header, Banner quảng cáo, Sản phẩm nổi bật, Danh mục sản phẩm, Footer" }], false),
                    row([{ text: "Sản phẩm", bold: true, width: 1800 }, { text: "Danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng, đặt hàng (checkout)" }], true),
                    row([{ text: "Tin tức/Blog", bold: true, width: 1800 }, { text: "Danh sách bài viết, chi tiết bài viết, kiến thức, thông báo" }], false),
                    row([{ text: "Quản trị (Admin)", bold: true, width: 1800 }, { text: "Quản lý đơn hàng, quản lý sản phẩm, quản lý danh mục, quản lý bài viết" }], true),
                    row([{ text: "SEO & Hệ thống", bold: true, width: 1800 }, { text: "Tối ưu hóa SEO, Sitemap, phân quyền quản trị cơ bản" }], false),
                ]
            }),

            para(""),

            // ===== 2. CHI TIẾT CHỨC NĂNG =====
            heading("2. BẢNG KÊ CHI TIẾT CHỨC NĂNG"),
            new Table({
                width: { size: PAGE_W, type: WidthType.DXA },
                columnWidths: [500, 2200, PAGE_W - 500 - 2200],
                rows: [
                    tableHeader([{ text: "#", width: 500 }, { text: "Hạng mục", width: 2200 }, { text: "Chi tiết" }]),
                    row([{ text: "1", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 500 }, { text: "Giao diện khách hàng", bold: true, width: 2200 }, { text: "Menu điều hướng, tìm kiếm sản phẩm; hiển thị responsive cho PC/Mobile" }], false),
                    row([{ text: "2", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 500 }, { text: "Hiển thị sản phẩm", bold: true, width: 2200 }, { text: "Danh sách sản phẩm theo danh mục; chi tiết sản phẩm gồm hình ảnh, giá, mô tả, nút Thêm vào giỏ" }], true),
                    row([{ text: "3", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 500 }, { text: "Giỏ hàng & Đặt hàng", bold: true, width: 2200 }, { text: "Quản lý sản phẩm trong giỏ, cập nhật số lượng; form đặt hàng điền thông tin người nhận (Checkout)" }], false),
                    row([{ text: "4", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 500 }, { text: "Tin tức / Blog", bold: true, width: 2200 }, { text: "Danh sách bài viết chia theo danh mục; trang chi tiết bài viết hỗ trợ định dạng phong phú (Rich Text)" }], true),
                    row([{ text: "5", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 500 }, { text: "Quản trị Đơn hàng", bold: true, width: 2200 }, { text: "Xem danh sách đơn đặt hàng; cập nhật trạng thái đơn (Chờ xử lý, Đang giao, Hoàn thành, Hủy)" }], false),
                    row([{ text: "6", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 500 }, { text: "Quản trị Sản phẩm", bold: true, width: 2200 }, { text: "Thêm, sửa, xóa sản phẩm; quản lý danh mục sản phẩm, cập nhật giá và hình ảnh" }], true),
                    row([{ text: "7", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 500 }, { text: "Quản trị Bài viết", bold: true, width: 2200 }, { text: "Tạo, chỉnh sửa, đăng bài viết blog; quản lý thẻ (tags) và danh mục bài viết" }], false),
                    row([{ text: "8", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 500 }, { text: "Tích hợp liên hệ", bold: true, width: 2200 }, { text: "Nút chat Zalo/Messenger nổi góc màn hình; Form liên hệ gửi thông tin" }], true),
                    row([{ text: "9", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 500 }, { text: "SEO & Hiệu suất", bold: true, width: 2200 }, { text: "Tối ưu hóa tốc độ tải trang; cài đặt Meta Title, Description, Sitemap động cho sản phẩm và bài viết" }], false),
                ]
            }),

            para(""),

            // ===== 3. BẢNG GIÁ =====
            heading("3. BẢNG GIÁ CHI TIẾT"),
            new Table({
                width: { size: PAGE_W, type: WidthType.DXA },
                columnWidths: [600, 3600, 2600, PAGE_W - 600 - 3600 - 2600],
                rows: [
                    tableHeader([{ text: "STT", width: 600 }, { text: "Hạng mục", width: 3600 }, { text: "Chi phí (VNĐ)", width: 2600 }, { text: "Ghi chú" }]),
                    row([{ text: "1", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 600 }, { text: "Thiết kế & Lập trình giao diện Frontend", width: 3600 }, { text: "3.500.000", align: AlignmentType.RIGHT, width: 2600 }, { text: "Trang chủ, sản phẩm, giỏ hàng, blog" }], false),
                    row([{ text: "2", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 600 }, { text: "Phát triển hệ thống Backend & Admin", width: 3600 }, { text: "3.500.000", align: AlignmentType.RIGHT, width: 2600 }, { text: "Quản lý đơn hàng, sản phẩm, bài viết" }], true),
                    row([{ text: "3", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 600 }, { text: "Chức năng Giỏ hàng, Đặt hàng & Liên hệ", width: 3600 }, { text: "1.500.000", align: AlignmentType.RIGHT, width: 2600 }, { text: "Form checkout, luồng mua hàng, Zalo" }], false),
                    row([{ text: "4", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 600 }, { text: "Tối ưu hóa SEO, Kiểm thử & Bàn giao", width: 3600 }, { text: "500.000", align: AlignmentType.RIGHT, width: 2600 }, { text: "Sitemap, Load speed, HDSD Admin" }], true),
                    row([{ text: "5", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 600 }, { text: "Máy chủ lưu trữ (VPS - 1 năm)", width: 3600 }, { text: "600.000", align: AlignmentType.RIGHT, width: 2600 }, { text: "Khách hàng gia hạn hàng năm" }], false),
                    row([{ text: "6", bold: true, color: BLUE, align: AlignmentType.CENTER, width: 600 }, { text: "Thuế VAT (10%)", width: 3600 }, { text: "60.000", align: AlignmentType.RIGHT, width: 2600 }, { text: "Chỉ áp dụng cho dịch vụ Máy chủ (VPS)" }], true),
                    new TableRow({
                        children: [
                            new TableCell({ borders, columnSpan: 2, shading: { fill: BLUE, type: ShadingType.CLEAR }, margins: { top: 110, bottom: 110, left: 130, right: 130 }, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: "TỔNG CỘNG (đã bao gồm VPS & VAT của VPS)", bold: true, color: WHITE, size: 20, font: "Arial" })] })] }),
                            new TableCell({ borders, shading: { fill: BLUE, type: ShadingType.CLEAR }, margins: { top: 110, bottom: 110, left: 130, right: 130 }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "9.660.000", bold: true, color: WHITE, size: 22, font: "Arial" })] })] }),
                            new TableCell({ borders, shading: { fill: BLUE, type: ShadingType.CLEAR }, margins: { top: 110, bottom: 110, left: 130, right: 130 }, children: [new Paragraph({ children: [] })] }),
                        ]
                    }),
                ]
            }),

            new Paragraph({
                spacing: { before: 120, after: 60 }, children: [
                    new TextRun({ text: "★ ", bold: true, color: BLUE, size: 18, font: "Arial" }),
                    new TextRun({ text: "Báo giá đã bao gồm phí bản quyền website vĩnh viễn và source code. Không bao gồm chi phí tên miền (domain), hosting/server và nội dung bài viết.", color: GRAY, size: 18, font: "Arial" }),
                ]
            }),

            para(""),

            // ===== 4. LỘ TRÌNH =====
            heading("4. LỘ TRÌNH TRIỂN KHAI (~2 TUẦN)"),
            new Table({
                width: { size: PAGE_W, type: WidthType.DXA },
                columnWidths: [1400, PAGE_W - 1400 - 2000, 2000],
                rows: [
                    tableHeader([{ text: "Giai đoạn", width: 1400 }, { text: "Nội dung công việc" }, { text: "Thời gian", width: 2000 }]),
                    row([{ text: "Tuần 1", bold: true, width: 1400 }, { text: "Khảo sát yêu cầu, xác nhận nội dung & hình ảnh; thiết kế giao diện (UI/UX); ký hợp đồng, thanh toán đợt 1" }, { text: "Ngày 1 – 7", width: 2000 }], false),
                    row([{ text: "Tuần 2", bold: true, width: 1400 }, { text: "Lập trình hoàn thiện tất cả trang; tích hợp form liên hệ & Zalo; SEO cơ bản; kiểm thử, sửa lỗi, bàn giao & thanh toán đợt 2" }, { text: "Ngày 8 – 14", width: 2000 }], true),
                ]
            }),

            para(""),

            // ===== 5. THANH TOÁN & BẢO HÀNH =====
            heading("5. ĐIỀU KHOẢN THANH TOÁN & BẢO HÀNH"),

            new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "Lịch thanh toán (2 đợt)", bold: true, size: 20, font: "Arial" })] }),
            new Table({
                width: { size: PAGE_W, type: WidthType.DXA },
                columnWidths: [1200, 1400, 2400, PAGE_W - 1200 - 1400 - 2400],
                rows: [
                    tableHeader([{ text: "Đợt", width: 1200 }, { text: "Tỷ lệ", width: 1400 }, { text: "Số tiền (VNĐ)", width: 2400 }, { text: "Thời điểm" }]),
                    row([{ text: "Đợt 1", bold: true, width: 1200 }, { text: "25%", align: AlignmentType.CENTER, width: 1400 }, { text: "2.415.000", align: AlignmentType.RIGHT, width: 2400 }, { text: "Sau khi ký hợp đồng" }], false),
                    row([{ text: "Đợt 2", bold: true, width: 1200 }, { text: "75%", align: AlignmentType.CENTER, width: 1400 }, { text: "7.245.000", align: AlignmentType.RIGHT, width: 2400 }, { text: "Sau khi nghiệm thu & bàn giao" }], true),
                    new TableRow({
                        children: [
                            new TableCell({ borders, columnSpan: 2, shading: { fill: MID_BLUE, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 130, right: 130 }, children: [new Paragraph({ children: [new TextRun({ text: "TỔNG CỘNG", bold: true, size: 20, color: BLUE, font: "Arial" })] })] }),
                            new TableCell({ borders, shading: { fill: MID_BLUE, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 130, right: 130 }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "9.660.000 VNĐ", bold: true, size: 20, color: BLUE, font: "Arial" })] })] }),
                            new TableCell({ borders, shading: { fill: MID_BLUE, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 130, right: 130 }, children: [new Paragraph({ children: [] })] }),
                        ]
                    }),
                ]
            }),

            new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "Bảo hành & Hỗ trợ", bold: true, size: 20, font: "Arial" })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Bảo hành 3 tháng sau bàn giao: sửa lỗi kỹ thuật do lập trình (không thu phí)", font: "Arial", size: 19 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Hỗ trợ kỹ thuật qua Zalo / điện thoại trong giờ hành chính", font: "Arial", size: 19 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Cập nhật nội dung, bổ sung tính năng sau bàn giao: báo giá riêng theo yêu cầu", font: "Arial", size: 19 })] }),

            new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ text: "Quyền sở hữu & Bản quyền", bold: true, size: 20, font: "Arial" })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Phí bản quyền website vĩnh viễn — không thu phí duy trì hàng năm", font: "Arial", size: 19 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Bàn giao toàn bộ source code và hướng dẫn cài đặt", font: "Arial", size: 19 })] }),
            new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Toàn bộ mã nguồn thuộc quyền sở hữu của MT Consultancy sau khi thanh toán đầy đủ", font: "Arial", size: 19 })] }),

            para(""),

            // ===== 6. LIÊN HỆ =====
            heading("6. THÔNG TIN LIÊN HỆ"),
            new Table({
                width: { size: PAGE_W, type: WidthType.DXA },
                columnWidths: [2800, PAGE_W - 2800],
                rows: [
                    row([{ text: "Đơn vị thực hiện", bold: true, width: 2800 }, { text: "CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ DOSU", bold: true, color: BLUE }], true),
                    row([{ text: "Người phụ trách", bold: true, width: 2800 }, { text: "Lại Thế Ngọc" }], false),
                    row([{ text: "Điện thoại / Zalo", bold: true, width: 2800 }, { text: "0346 437 915" }], true),
                    row([{ text: "Email", bold: true, width: 2800 }, { text: "support@dosutech.site" }], false),
                    row([{ text: "Website", bold: true, width: 2800 }, { text: "https://dosutech.site" }], true),
                    row([{ text: "Địa chỉ", bold: true, width: 2800 }, { text: "Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây Mỗ, TP Hà Nội, Việt Nam" }], false),
                    row([{ text: "MST (xuất VAT)", bold: true, width: 2800 }, { text: "0110638839" }], true),
                ]
            }),

            para(""),

            // ===== CLOSING =====
            new Table({
                width: { size: PAGE_W, type: WidthType.DXA },
                columnWidths: [PAGE_W],
                rows: [new TableRow({
                    children: [new TableCell({
                        borders: noBorders,
                        shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
                        margins: { top: 240, bottom: 240, left: 400, right: 400 },
                        children: [
                            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Trân trọng cảm ơn Quý khách hàng Doãn Minh Quang.", bold: true, color: BLUE, size: 22, font: "Arial" })] }),
                            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [new TextRun({ text: "Chúng tôi mong được đồng hành cùng sự phát triển của Quý khách!", color: GRAY, size: 19, font: "Arial" })] }),
                            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: "— DOSU Co., Ltd —", bold: true, color: BLUE, size: 19, font: "Arial" })] }),
                        ]
                    })]
                })]
            }),

        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("./BAO_GIA_DOSU_SUP.docx", buffer);
    console.log("Done");
});