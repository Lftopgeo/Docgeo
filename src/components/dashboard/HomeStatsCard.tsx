import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface HomeStatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  subValue?: string;
  subValueColor?: string;
  progress?: number;
  isDarkMode?: boolean;
}

const HomeStatsCard = ({
  title,
  value,
  icon,
  subValue,
  subValueColor = "text-green-500",
  progress,
  isDarkMode = true,
}: HomeStatsCardProps) => {
  return (
    <Card
      className={
        isDarkMode
          ? "bg-[#0F172A] border-blue-600"
          : "bg-white border-[#B0BEC5] shadow-sm"
      }
    >
      <CardHeader className="pb-2">
        <CardTitle
          className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-[#757575]"}`}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {icon && <div className="mr-2">{icon}</div>}
          <span
            className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#212121]"}`}
          >
            {value}
          </span>
        </div>
        {subValue && (
          <p className={`text-xs ${subValueColor} mt-1`}>{subValue}</p>
        )}
        {progress !== undefined && (
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-[#FF6B00] h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HomeStatsCard;
