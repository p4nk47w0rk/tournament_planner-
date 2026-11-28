export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box",
};

export const buttonStyle = (loading: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "12px",
  backgroundColor: "#D97757",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: 600,
  cursor: loading ? "not-allowed" : "pointer",
});

export const containerStyle: React.CSSProperties = {
  maxWidth: "400px",
  margin: "100px auto",
  padding: "24px",
};
