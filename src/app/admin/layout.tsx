export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FAFBFC', color: '#023047' }}>
        {children}
      </body>
    </html>
  );
}
