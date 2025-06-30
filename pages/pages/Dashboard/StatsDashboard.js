import { Button, Card, Col, Row, Select, Space, Spin, Statistic } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdArrowBackIos, MdRefresh } from "react-icons/md";
import { useRouter } from "next/router";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatsService from "../../../src/services/StatsService";

const { Option } = Select;

const segmentDetails = {
  H: { segmentNum: 8, timeframeName: "hour" },
  D: { segmentNum: 7, timeframeName: "day" },
  W: { segmentNum: 4, timeframeName: "week" },
  M: { segmentNum: 6, timeframeName: "month" },
  A: { segmentNum: 5, timeframeName: "year" },
};

const PieChartComponent = ({ title, data }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
  return (
    <div>
      <PieChart width={150} height={150}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="_id"
          outerRadius={40}
          cx={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [value, name]} />
        <Legend />
      </PieChart>
    </div>
  );
};

const StatsDashboard = ({ funnelId }) => {
  const [mainStats, setMainStats] = useState({});
  const [segmentedStats, setSegmentedStats] = useState([]);
  const [KPIs, setKPIs] = useState([]);
  const [timeToApply, setTimeToApply] = useState({});
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [timeframe, setTimeframe] = useState("D");
  const router = useRouter();;

  const isLoading = useMemo(
    () => loading1 || loading2 || loading3,
    [loading1, loading2, loading3]
  );

  const chartData = [...segmentedStats].reverse().map((segment) => ({
    name: `${segment.idx === 1 ? "This" : segment.idx - 1} ${
      segmentDetails[timeframe].timeframeName
    }${segment.idx <= 2 ? "" : "s"}${segment.idx === 1 ? "" : " ago"}`,
    Clicks: segment.clicks,
    Conversions: segment.conversions,
    Applicants: segment.applicants,
    Qualified: segment.qualified,
    Meetings: segment.meetings,
    Hires: segment.hires,
  }));

  const loadData = useCallback(() => {
    setLoading1(true);
    setLoading2(true);
    setLoading3(true);
    setLoading4(true);

    StatsService.getNumbers(funnelId ?? "")
      .then(({ data }) => {
        setMainStats(data);
      })
      .finally(() => {
        setLoading1(false);
      });
    StatsService.getTimeToApply(funnelId ?? "")
      .then(({ data }) => {
        setTimeToApply(data);
      })
      .finally(() => {
        setLoading2(false);
      });
    StatsService.getSegmentedNumbers(funnelId ?? "", timeframe)
      .then(({ data }) => {
        setSegmentedStats(data);
      })
      .finally(() => {
        setLoading3(false);
      });

    StatsService.getSurveys(funnelId ?? "")
      .then(({ data }) => {
        setKPIs(data.KPIs);
      })
      .finally(() => {
        setLoading4(false);
      });
  }, [timeframe, funnelId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const utmList = [
    {
      name: "utmCampaign",
      title: "UTM Campaign",
      data: mainStats.utmCampaignAggregation,
    },
    {
      name: "utmSource",
      title: "UTM Source",
      data: mainStats.utmSourceAggregation,
    },
    {
      name: "utmMedium",
      title: "UTM Medium",
      data: mainStats.utmMediumAggregation,
    },
    {
      name: "utmContent",
      title: "UTM Content",
      data: mainStats.utmContentAggregation,
    },
    {
      name: "utmTerm",
      title: "UTM Term",
      data: mainStats.utmTermAggregation,
    },
    {
      name: "salesforceUUID",
      title: "Salesforce UUID",
      data: mainStats.salesforceUuidAggregation,
    },
  ];

  return (
    <>
      <div>
        <Row gutter={[16, 16]}>
          <Col span={24} className="mb-2">
            <Card>
              <div className="mb-2 flex justify-between">
                <h2 className="font-semibold ">Your overall performance</h2>{" "}
                {isLoading ? (
                  <Spin />
                ) : (
                  <MdRefresh
                    size={20}
                    onClick={loadData}
                    className="cursor-pointer"
                  />
                )}
              </div>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Clicks"
                    value={mainStats.clicks}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Conversions"
                    value={mainStats.conversions}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Applicants"
                    value={mainStats.applicants}
                    valueStyle={{ color: "#fadb14" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Qualified"
                    value={mainStats.qualified}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Meetings"
                    value={mainStats.meetings}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Hires"
                    value={mainStats.hires}
                    valueStyle={{ color: "#eb2f96" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} className="mb-2">
            <Card>
              <div className="flex justify-between mb-2">
                <h2 className="font-semibold">
                  How your funnel{funnelId ? "" : "s"} performed during the last{" "}
                  {segmentDetails[timeframe].segmentNum}{" "}
                  {segmentDetails[timeframe].timeframeName}s
                </h2>
                <Space>
                  <Select
                    defaultValue={timeframe}
                    style={{ width: 150 }}
                    onChange={(value) => setTimeframe(value)}
                  >
                    <Option value="H">
                      Last {segmentDetails["H"].segmentNum} hours
                    </Option>
                    <Option value="D">
                      Last {segmentDetails["D"].segmentNum} days
                    </Option>
                    <Option value="W">
                      Last {segmentDetails["W"].segmentNum} weeks
                    </Option>
                    <Option value="M">
                      Last {segmentDetails["M"].segmentNum} months
                    </Option>
                    <Option value="A">
                      Last {segmentDetails["A"].segmentNum} years
                    </Option>
                  </Select>

                  {isLoading ? (
                    <Spin />
                  ) : (
                    <MdRefresh
                      size={20}
                      onClick={loadData}
                      className="cursor-pointer"
                    />
                  )}
                </Space>
              </div>
              {/* Display segmentedStats data here */}
              <div className="max-w-full overflow-auto">
                <LineChart width={800} height={400} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Clicks" stroke="#8884d8" />
                  <Line
                    type="monotone"
                    dataKey="Conversions"
                    stroke="#82ca9d"
                  />
                  <Line type="monotone" dataKey="Applicants" stroke="#ff7300" />
                  <Line type="monotone" dataKey="Qualified" stroke="#ff3860" />
                  <Line type="monotone" dataKey="Meetings" stroke="#ffaa00" />
                  <Line type="monotone" dataKey="Hires" stroke="#00bfff" />
                </LineChart>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} className="mb-2">
            <Card>
              <div className="mb-2 flex justify-between">
                <h2 className="font-semibold">Times</h2>
                {isLoading ? (
                  <Spin />
                ) : (
                  <MdRefresh
                    size={20}
                    onClick={loadData}
                    className="cursor-pointer"
                  />
                )}
              </div>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Average Time to CTA Click"
                    value={timeToApply.averageTimeToCTASeconds}
                    suffix="s"
                    precision={2}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Average Time to Apply"
                    value={timeToApply.averageTimeToApplySeconds}
                    suffix="s"
                    precision={2}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {KPIs.length > 0 && (
          <Row gutter={[16, 16]}>
            <Col span={24} className="mb-2">
              <Card>
                <div className="mb-2 flex justify-between">
                  <h2 className="font-semibold">Candidate Surveys</h2>
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <MdRefresh
                      size={20}
                      onClick={loadData}
                      className="cursor-pointer"
                    />
                  )}
                </div>

                <Row gutter={[16, 16]} className="mt-2">
                  {KPIs.map((kpi) => (
                    <Col span={8} key={kpi.key}>
                      <Card>
                        <div style={{ textAlign: "center" }}>
                          <Statistic
                            title={kpi.key}
                            value={kpi.average.toFixed(2)}
                          />
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <p>
                            Min: {kpi.min} | Max: {kpi.max}
                          </p>
                          <p>Median: {kpi.median}</p>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        )}

        {utmList.filter((e) => !!e?.data && e?.data?.length > 0).length > 0 && (
          <>
            <div className="mb-2 flex justify-between items-end mt-5">
              <h2 className="font-semibold mt-5">UTM Tracking</h2>
              {isLoading ? (
                <Spin />
              ) : (
                <MdRefresh
                  size={20}
                  onClick={loadData}
                  className="cursor-pointer"
                />
              )}
            </div>

            <Row gutter={[16, 16]} className="mt-2">
              {utmList
                .filter((e) => !!e?.data && e?.data?.length > 0)
                .map((utmField) => (
                  <Col span={8} key={utmField.name}>
                    <Card>
                      <div style={{ textAlign: "center" }}>
                        <h3>{utmField.title}</h3>
                        {utmField.data?.length > 0 ? (
                          <PieChartComponent
                            title={utmField.title}
                            data={utmField.data}
                          />
                        ) : (
                          <p>No data available</p>
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default StatsDashboard;
