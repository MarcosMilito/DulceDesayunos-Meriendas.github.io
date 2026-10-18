import AdminDashboard from "@/components/admin-dashboard";
import { requireChatGPTUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(user.email.toLowerCase())) {
    return <main className="access-denied"><div><span>🔒</span><h1>Acceso restringido</h1><p>Iniciaste sesión correctamente, pero esta cuenta no está autorizada para administrar Dulce.</p><small>Configurá <code>ADMIN_EMAILS</code> en el entorno de publicación.</small><a href="/">Volver a la tienda</a></div></main>;
  }
  return <AdminDashboard demo userName={user.fullName ?? user.email.split("@")[0]} />;
}
