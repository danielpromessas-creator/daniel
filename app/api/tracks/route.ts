import { list, del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// Lista todas as faixas de áudio hospedadas no Blob
export async function GET() {
  try {
    const { blobs } = await list()
    const tracks = blobs
      .filter((b) => /\.(mp3|wav|ogg|m4a|mp4)$/i.test(b.pathname))
      .sort((a, b) => a.pathname.localeCompare(b.pathname))
      .map((b) => ({
        url: b.url,
        pathname: b.pathname,
        // Nome limpo a partir do pathname (remove sufixo aleatório e extensão)
        title: prettifyName(b.pathname),
        size: b.size,
        uploadedAt: b.uploadedAt,
      }))

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error("[v0] Erro ao listar faixas:", error)
    return NextResponse.json({ error: "Falha ao listar faixas" }, { status: 500 })
  }
}

// Remove uma faixa pelo URL
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: "URL não informada" }, { status: 400 })
    }
    await del(url)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao remover faixa:", error)
    return NextResponse.json({ error: "Falha ao remover faixa" }, { status: 500 })
  }
}

function prettifyName(pathname: string) {
  const file = pathname.split("/").pop() || pathname
  return file
    .replace(/-[a-zA-Z0-9]{8,}(?=\.[^.]+$)/, "") // remove sufixo aleatório do Blob
    .replace(/\.[^.]+$/, "") // remove extensão
    .replace(/[_-]+/g, " ") // troca _/- por espaço
    .trim()
    .toUpperCase()
}
