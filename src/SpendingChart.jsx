import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const categoryColors = {
  housing: "#ee6f88",
  food: "#529fe6",
  salary: "#f7d16f",
  utilities: "#6cbdb8",
  transport: "#9366ee",
  entertainment: "#f0a144",
  other: "#a0a0a0",
};

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

function SpendingChart({ transactions }) {
  const totals = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
    });

  const data = Object.entries(totals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="spending-chart">
      <h2>Spending by Category</h2>
      {data.length === 0 ? (
        <p className="chart-empty">No expenses to show yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="category"
              tickFormatter={capitalize}
              tickLine={false}
              tick={{ fill: "#444", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={v => `$${v}`}
              tickLine={false}
              tick={{ fill: "#444", fontSize: 12 }}
              width={55}
            />
            <Tooltip
              formatter={value => [`$${value}`, "Spent"]}
              labelFormatter={capitalize}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Bar dataKey="total" maxBarSize={50}>
              {data.map(d => (
                <Cell key={d.category} fill={categoryColors[d.category] || categoryColors.other} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default SpendingChart
