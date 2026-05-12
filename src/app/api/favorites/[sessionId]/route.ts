export async function GET() {
  return new Response(JSON.stringify({ error: "Favorites are stored client-side only." }), { status: 405, headers: { "Content-Type": "application/json" } });
}

export async function POST() {
  return new Response(JSON.stringify({ error: "Favorites are stored client-side only." }), { status: 405, headers: { "Content-Type": "application/json" } });
}

export async function DELETE() {
  return new Response(JSON.stringify({ error: "Favorites are stored client-side only." }), { status: 405, headers: { "Content-Type": "application/json" } });
}
