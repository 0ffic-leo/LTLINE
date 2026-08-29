import base64
import re
import subprocess
from pathlib import Path
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.shared import Cm, Pt
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

LOGO_B64 = """__LOGO__"""
ROOT = Path("docs/sq")
OUT = Path("word-pack")
LOGO = Path("/tmp/ltline-logo.png")

def set_cell_margins(cell, top=80, start=80, bottom=80, end=80):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = tcPr.first_child_found_in("w:tcMar")
    if tcMar is None:
        tcMar = OxmlElement("w:tcMar")
        tcPr.append(tcMar)
    for m, v in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tcMar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tcMar.append(node)
        node.set(qn("w:w"), str(v))
        node.set(qn("w:type"), "dxa")

def remove_table_borders(table):
    tblPr = table._tbl.tblPr
    borders = tblPr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tblPr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = borders.find(qn(f"w:{edge}"))
        if el is None:
            el = OxmlElement(f"w:{edge}")
            borders.append(el)
        el.set(qn("w:val"), "nil")

def add_page_field(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = paragraph.add_run("Faqja ")
    run.font.size = Pt(8)
    fld = OxmlElement("w:fldSimple")
    fld.set(qn("w:instr"), "PAGE")
    paragraph._p.append(fld)
    run = paragraph.add_run(" nga ")
    run.font.size = Pt(8)
    fld2 = OxmlElement("w:fldSimple")
    fld2.set(qn("w:instr"), "NUMPAGES")
    paragraph._p.append(fld2)

def metadata(md):
    title = "LTLINE"
    m = re.search(r"^#\s+(.+)$", md, re.M)
    if m:
        title = re.sub(r"^LTLINE\s*[—-]\s*", "", m.group(1)).strip()
    def grab(patterns, default):
        for pattern in patterns:
            m = re.search(pattern, md, re.I)
            if m: return m.group(1).strip()
        return default
    return title, grab([r"\*\*ID(?: e dokumentit)?\s*:??\*\*\s*([^|\n]+)", r"\*\*ID\*\*\s*:??\s*([^|\n]+)"], "TBD"), grab([r"\*\*Revizioni\*\*\s*:??\s*([^|\n]+)"], "1.0"), grab([r"\*\*Statusi\*\*\s*:??\s*([^|\n]+)"], "PROJEKT")

def style_document(doc):
    styles = doc.styles
    styles["Normal"].font.name = "Aptos"
    styles["Normal"].font.size = Pt(10.5)
    for name, size in (("Title",20),("Heading 1",16),("Heading 2",13),("Heading 3",11)):
        styles[name].font.name = "Aptos"
        styles[name].font.size = Pt(size)
        styles[name].font.bold = True
    sec = doc.sections[0]
    sec.top_margin = Cm(2.4); sec.bottom_margin = Cm(2.0); sec.left_margin = Cm(2.2); sec.right_margin = Cm(2.2)
    sec.header_distance = Cm(0.8); sec.footer_distance = Cm(0.8)

def brand_document(path, md_text):
    doc = Document(path); style_document(doc)
    title, doc_id, rev, status = metadata(md_text)
    sec = doc.sections[0]
    header = sec.header
    table = header.add_table(rows=1, cols=2, width=Cm(16.6))
    remove_table_borders(table)
    left, right = table.rows[0].cells
    for cell in (left, right):
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        set_cell_margins(cell, 40, 40, 40, 40)
    lp = left.paragraphs[0]
    lr = lp.add_run(); lr.add_picture(str(LOGO), width=Cm(1.7))
    rp = right.paragraphs[0]; rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = rp.add_run("LTLINE\n"); r.bold = True; r.font.size = Pt(10)
    r = rp.add_run(title + "\n"); r.bold = True; r.font.size = Pt(9)
    r = rp.add_run(f"ID: {doc_id}  |  Revizion: {rev}  |  Status: {status}"); r.font.size = Pt(8)
    footer = sec.footer
    fp = footer.paragraphs[0]; fp.text = "LTLINE — Dokument i Kontrolluar"; fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
    for run in fp.runs: run.font.size = Pt(8)
    add_page_field(footer.add_paragraph())
    doc.save(path)

def main():
    LOGO.write_bytes(base64.b64decode(LOGO_B64))
    import shutil
    if OUT.exists(): shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    for md_file in sorted(ROOT.rglob("*.md")):
        rel = md_file.relative_to(ROOT); out = OUT / rel.with_suffix(".docx")
        out.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["pandoc", str(md_file), "-o", str(out), "--from=gfm", "--toc"], check=True)
        brand_document(out, md_file.read_text(encoding="utf-8"))
    (OUT / "README-WORD-PACK.md").write_text("# LTLINE — Word Pack\n\nPaketë Word e gjeneruar nga docs/sq me standard të përbashkët LTLINE.\n", encoding="utf-8")
    with (OUT / "FILE-LIST.txt").open("w", encoding="utf-8") as f:
        for p in sorted(OUT.rglob("*.docx")): f.write(str(p.relative_to(OUT)) + "\n")

if __name__ == "__main__": main()
