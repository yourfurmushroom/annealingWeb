import React, { useEffect, useState } from "react";
import { TagsDefinition } from "./Utilities"; // 假设第一段代码保存在 TagsDefinition.ts

interface AttributeInterface {
  setRow: React.Dispatch<React.SetStateAction<number>>,
  setColumn: React.Dispatch<React.SetStateAction<number>>,
  row: number,
  column: number,
  gridStatus: string[][]
}

export default function AttributePanel({ gridStatus, setRow, setColumn, column, row }: AttributeInterface) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parameters, setParameters] = useState<Record<string, any>>({}); // 规则参数
  const [overallScore, setOverallScore] = useState<number>(0); // 总体得分
  const [scoreBreakdown, setScoreBreakdown] = useState<Record<string, number>>({}); // 各规则得分

  // 当 shift 或 parameters 变化时，重新计算得分
  useEffect(() => {
    async function calculateScores() {
      const breakdown: Record<string, number> = {};
      let totalScore = 0;
      let validRules = 0;

      // 遍历所有规则，计算得分
      for (const tag of TagsDefinition) {
        const allParamsDefined = tag.parameters.every(p => parameters[p.parameter_alias] !== undefined);
        if (!allParamsDefined) continue;

        try {
          const score = await tag.evaluate(
            gridStatus.map(row => row.map(cell => (cell === '上班' ? 1 : 0))),
            parameters
          );
          breakdown[tag.text] = score;
          totalScore += score;
          validRules += 1;
        } catch (error) {
          console.error(`Error evaluating ${tag.text}:`, error);
        }
      }

      // 计算平均得分
      setOverallScore(validRules > 0 ? totalScore / validRules : 0);
      setScoreBreakdown(breakdown);
    }

    if (gridStatus.length > 0) {
      calculateScores();
    }
  }, [gridStatus, parameters]);

  return (
    <div className="flex flex-col justify-around gap-y-4 w-full h-[100vh] p-4">
      <Score overallScore={overallScore} scoreBreakdown={scoreBreakdown} />
      <ShiftConfiguration gridStatus={gridStatus} setRow={setRow} setColumn={setColumn} column={column} row={row} />
      <Constraints parameters={parameters} setParameters={setParameters} />
    </div>
  );
}

function Score({ overallScore, scoreBreakdown }: { overallScore: number, scoreBreakdown: Record<string, number> }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* 总体得分进度条 */}
      <div className="flex justify-center mb-6">
        <CircleProgress value={overallScore * 100} />
      </div>

      {/* 分数细项 */}
      <div className="space-y-3">
        {Object.entries(scoreBreakdown).map(([key, value], index) => {
          const uniqueKey = `${key}-${index}`;
          return (
            <div
              key={uniqueKey}
              className="flex justify-between border-b pb-2"
            >
              <span className="text-gray-700">{key}</span>
              <span className="font-semibold text-gray-900">
                {(value * 100).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShiftConfiguration({ setRow, setColumn, column, row }: AttributeInterface) {

  return (
    <div className="h-fit bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">排班配置</h2>
      <div className="mb-4">
        <label className="mr-2">員工數量:</label>
        <input
          type="number"
          value={row}
          onChange={(e) => setRow(Number(e.target.value))}
          className="border p-1 rounded"
          min="1"
        />
        <label className="ml-4 mr-2">天數:</label>
        <input
          type="number"
          value={column}
          onChange={(e) => setColumn(Number(e.target.value))}
          className="border p-1 rounded"
          min="1"
        />
      </div>

    </div>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Constraints({ parameters, setParameters }: { parameters: Record<string, any>, setParameters: React.Dispatch<React.SetStateAction<Record<string, any>>> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleParameterChange = (tagKey: string, paramAlias: string, value: any) => {
    setParameters((prev) => ({
      ...prev,
      [paramAlias]: value,
    }));
  };

  return (
    <div className="h-fit bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">规则配置</h2>
      {TagsDefinition.map((tag) => (
        <div key={tag.key} className="mb-4">
          <h3 className="font-semibold">{tag.text}</h3>
          <p className="text-sm text-gray-600">{tag.description}</p>
          {tag.parameters.map((param) => (
            <div key={param.parameter_alias} className="mt-2">
              <label className="mr-2">{param.parameter_name}:</label>
              <input
                type="number"
                value={parameters[param.parameter_alias] || ""}
                onChange={(e) =>
                  handleParameterChange(tag.key, param.parameter_alias, Number(e.target.value))
                }
                className="border p-1 rounded"
                placeholder="请输入值"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// CircleProgress 组件（保持不变）
function CircleProgress({ value }: { value: number }) {
  const radius = 50;
  const stroke = 10;
  const normalized = radius - stroke / 2;
  const circumference = normalized * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="120" height="120" className="transform -rotate-90">
      <circle
        r={normalized}
        cx="60"
        cy="60"
        strokeWidth={stroke}
        stroke="#e5e7eb"
        fill="transparent"
      />
      <circle
        r={normalized}
        cx="60"
        cy="60"
        strokeWidth={stroke}
        stroke="#3b82f6"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="60"
        y="65"
        textAnchor="middle"
        fontSize="18"
        fill="#000"
        className="rotate-90 origin-center"
      >
        {value.toFixed(0)}%
      </text>
    </svg>
  );
}