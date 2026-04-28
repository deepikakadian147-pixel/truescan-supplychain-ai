export async function scanProduct() {
  const res = await fetch("http://localhost:5000/scan", {
    method: "POST",
  });

  return res.json();
}
