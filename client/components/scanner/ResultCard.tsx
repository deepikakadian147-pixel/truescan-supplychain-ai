export default function ResultCard({ result }: any) {
  return (
    <div style={{ border: "1px solid #00FF41", padding: 10 }}>
      <p>Status: {result.status}</p>
      <p>Confidence: {result.confidence}</p>
    </div>
  );
}
