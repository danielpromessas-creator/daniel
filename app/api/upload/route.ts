import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { type NextRequest, NextResponse } from "next/server"

// Upload direto do cliente para o Blob (suporta arquivos grandes de áudio)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "audio/mpeg",
            "audio/mp3",
            "audio/wav",
            "audio/ogg",
            "audio/x-m4a",
            "audio/mp4",
          ],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({}),
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[v0] Upload concluído:", blob.pathname)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("[v0] Erro no upload:", error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    )
  }
}
