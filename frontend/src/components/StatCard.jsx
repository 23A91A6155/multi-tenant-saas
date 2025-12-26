export default function StatCard({ title, value }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: 15,
      width: 200,
      textAlign: "center"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
