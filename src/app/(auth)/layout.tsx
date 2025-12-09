export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-obsidian min-h-screen">
      {children}
    </div>
  );
}

