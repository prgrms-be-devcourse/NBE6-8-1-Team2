"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
} from "recharts";
import { apiFetch } from "@/lib/apiFetch";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";

const koLocale = ko as any;

type SalesData = {
  date: string;
  totalSales: number;
};

export default function SalesChart() {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });
  const [toDate, setToDate] = useState(new Date());

  const fetchSales = async () => {
    const from = format(fromDate, "yyyy-MM-dd");
    const to = format(toDate, "yyyy-MM-dd");
    apiFetch<SalesData[]>(`/admin/sales?from=${from}&to=${to}`)
      .then((res) => setData(res))
      .catch((err) => {
        toast.error("매출 데이터를 불러오는 데 실패했습니다.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSales();
  }, [fromDate, toDate]);

  if (loading) return <p className="text-gray-500">로딩 중...</p>;
  if (data.length === 0) return <p>데이터가 없습니다.</p>;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full max-w-5xl mx-auto aspect-[3/2] bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">📈 최근 매출 통계</h2>
        <div className="flex gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">시작일</label>
            <DatePicker
              locale={koLocale}
              selected={fromDate}
              onChange={(date) => {
                if (date) setFromDate(date);
              }}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded px-3 py-2 w-40"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">종료일</label>
            <DatePicker
              locale={koLocale}
              selected={toDate}
              onChange={(date) => {
                if (date) setToDate(date);
              }}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded px-3 py-2 w-40"
            />
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            width={80}
            tickFormatter={(v: number) => `₩${v.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value: number) => `₩${value.toLocaleString()}`}
          />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#8884d8"
            strokeWidth={2}
          />
          {data
            .filter((d) => d.date === today)
            .map((d, idx) => (
              <ReferenceDot
                key={idx}
                x={d.date}
                y={d.totalSales}
                r={6}
                fill="red"
                stroke="black"
                label={{
                  value: "오늘",
                  position: "top",
                  fill: "red",
                  fontSize: 12,
                }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
