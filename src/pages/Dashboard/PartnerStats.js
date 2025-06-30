import { Card, Col, Progress, Row, Spin, Statistic } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdRefresh } from "react-icons/md";
import { useSelector } from "react-redux";
import { currencies } from "../../data/currencies";
import { getPartner } from "../../redux/auth/selectors";
import PartnerService from "../../services/PartnerService";
import { partner } from "../../constants";

const PartnerStats = () => {
  const [mainStats, setMainStats] = useState({});
  const [loading1, setLoading1] = useState(false);

  const isLoading = useMemo(() => loading1 || [loading1]);

  const loadData = useCallback(() => {
    setLoading1(true);

    PartnerService.getNumbers()
      .then(({ data }) => {
        setMainStats(data);
      })
      .finally(() => {
        setLoading1(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <div>
        <h1 className="font-bold mb-4 text-lg">Saas Statistics</h1>

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
                    title="Total Users"
                    value={mainStats.users}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Monthly Active Users"
                    value={mainStats.monthlyActiveUsers}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Subscribed Users"
                    value={mainStats.payingUsers}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Users Subscribed Once"
                    value={mainStats.usersPaidOnce}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Monthly Recurring Revenue"
                    value={mainStats.currentMRR}
                    prefix={
                      currencies.find((c) => c.iso === partner?.currency)
                        ?.symbol ?? "$"
                    }
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <div className="ant-statistic css-dev-only-do-not-override-qk40m6">
                    <div className="ant-statistic-title">Paid User Ratio</div>
                    <Progress
                      type="circle"
                      size={60}
                      percent={mainStats.paidUserRatio}
                      status="active"
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="ant-statistic css-dev-only-do-not-override-qk40m6">
                    <div className="ant-statistic-title">Churn Rate</div>
                    <Progress
                      type="circle"
                      size={60}
                      percent={mainStats.churn}
                      status="active"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PartnerStats;
