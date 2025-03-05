import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Participant } from "../../types/participant"; 

const COLORS = ["#0057b8", "#0bc5a1", "#d9d9d9", "#ffcc00", "#ff4136"];
const PARTICIPANT_COLORS: { [key: string]: string } = {};

type ChartDataItem = {
  name: string;
  value: number;
  color: string;
};

const ParticipationChart = ({ participants }: { participants: Participant[] }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    setChartData(
      participants.map((item: Participant, index: number) => {
        const participantName = `${item.firstName} ${item.lastName}`;
        if (!PARTICIPANT_COLORS[participantName]) {
          PARTICIPANT_COLORS[participantName] = COLORS[index % COLORS.length];
        }
        return {
          name: participantName,
          value: item.participation,
          color: PARTICIPANT_COLORS[participantName],
        };
      })
    );
  }, [participants]); 

  return (
    <div className="w-1/3 min-w-[320px] flex justify-center">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="45%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={1}
              label={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
              ))}
            </Pie>

            <Legend
              layout="vertical"
              align="center"
              verticalAlign="middle"
              wrapperStyle={{ right: "-5px", position: "absolute" }}
              content={({ payload }) => (
                <ul className="list-none m-0 p-0 space-y-4">
                  {payload?.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center space-x-1">
                      <span
                        style={{
                          display: "inline-block",
                          width: 17,
                          height: 17,
                          backgroundColor: entry.color,
                          borderRadius: "4px",
                          marginRight: 8,
                        }}
                      ></span>
                      <span
                        style={{
                          color: entry.color,
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginRight: "max(15px, 1vw)",
                        }}
                      >
                        {entry.value}
                      </span>
                    </li>
                  )) || null}
                </ul>
              )}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">Nenhum dado disponível</p>
      )}
    </div>
  );
};

export default ParticipationChart;

