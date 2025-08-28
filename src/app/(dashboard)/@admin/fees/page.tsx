"use client";
import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersistentTab } from "@/hooks/usePersistentTab";
import FeesHeaderCard from "./(components)/FeesHeaderCard";
import RevenueCard from "../../@admin/dashboard/components/RevenueCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CustomModal } from "../../components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import InvoiceForm from "./(components)/InvoiceForm";
import InvoiceReferenceForm from "./(components)/InvoiceReferenceForm";
import InvoiceTab from "./(components)/InvoiceTab";
import DiscountTab from "./(components)/DiscountTab";
import PaymentLogsTab from "./(components)/PaymentLogsTab";
import StudentListTab from "./(components)/StudentListTab";
import OfflinePaymentsTab from "./(components)/OfflinePaymentsTab";
import { useGetSessionsQuery, useGetPaymentSummaryQuery } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

// Type for session data from API
interface SessionData {
  id: string;
  name: string;
  status: boolean;
  terms: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: boolean;
  }>;
  classes: Array<{
    id: string;
    name: string;
    category: string;
    assignedArms: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

export default function FeesPage() {
  // const userData = useSelector((state: RootState) => state.user.user);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [openDiscountModal, setOpenDiscountModal] = useState(false);

  // Fetch sessions from API
  const { data: sessionsData, isLoading: isLoadingSessions } =
    useGetSessionsQuery({});

  // Set initial selected session ID to the first session from API data, or fallback
  const [selectedSessionId, setSelectedSessionId] = useState(() => {
    return sessionsData?.data?.[0]?.id || "";
  });

  // Fetch payment summary data
  const { data: paymentSummary, isLoading: isLoadingPaymentSummary } = useGetPaymentSummaryQuery({});

  // Transform payment summary data for revenue cards
  const revenueData = [
    {
      title: "Total Revenue",
      amount: paymentSummary?.summary?.expectedRevenue?.toString() || "0",
      icon: "/expected.png",
    },
    {
      title: "Total Collected",
      amount: paymentSummary?.summary?.generatedRevenue?.toString() || "0",
      icon: "/generated.png",
    },
    {
      title: "Outstanding Fees",
      amount: paymentSummary?.summary?.outstandingRevenue?.toString() || "0",
      icon: "/outstanding.png",
    },
  ];

  // Transform class stats data for the chart
  const classRevenueData = useMemo(() => 
    paymentSummary?.classStats?.map((stat: any) => ({
      name: stat.className,
      expected: stat.totalAmount,
      paid: stat.paidAmount,
    })) || [], [paymentSummary?.classStats]
  );

  // Update selectedSessionId when sessionsData changes and no session is selected
  React.useEffect(() => {
    if (sessionsData?.data?.[0]?.id && !selectedSessionId) {
      setSelectedSessionId(sessionsData.data[0].id);
    }
  }, [sessionsData, selectedSessionId]);

  const handleInvoiceClick = () => setOpenInvoiceModal(true);
  const handleDiscountClick = () => setOpenDiscountModal(true);
  const TAB_KEY = `fees-page-tabs`;
  const tabOptions = [
    "finance",
    "students",
    "invoice",
    "discount",
    "payment",
    "offline",
  ];
  const [activeTab, setActiveTab] = usePersistentTab(
    TAB_KEY,
    tabOptions,
    tabOptions[0]
  );

  // Transform sessions data for FeesHeaderCard
  const sessionOptions =
    sessionsData?.data?.map((session: SessionData) => ({
      id: session.id,
      label: session.name,
    })) || [];

  // Show loading state if data is being fetched
  if (isLoadingSessions || isLoadingPaymentSummary) {
    return <LoaderComponent />;
  }

  return (
    <div className=''>
      <FeesHeaderCard
        sessions={sessionOptions}
        selectedSessionId={selectedSessionId}
        onSessionChange={setSelectedSessionId}
        onInvoiceClick={handleInvoiceClick}
        onDiscountClick={handleDiscountClick}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className='w-full relative'>
          <div className='border-b-2 absolute bottom-0 w-full'></div>

          <TabsList className={`bg-transparent shadow-none space-x-5  `}>
            <TabsTrigger
              className='relative data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='finance'
            >
              Financial Report{" "}
            </TabsTrigger>
            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='students'
            >
              Student&apos;s List
            </TabsTrigger>
            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='invoice'
            >
              Invoice{" "}
            </TabsTrigger>
            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='discount'
            >
              {" "}
              Discounts
            </TabsTrigger>

            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='payment'
            >
              Payment Logs
            </TabsTrigger>

            <TabsTrigger
              className='relative  data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-bold  data-[state=active]:text-primary data-[state=active]:after:content-[""] data-[state=active]:after:block data-[state=active]:after:absolute data-[state=active]:after:left-[-5px] data-[state=active]:after:right-[-5px]  data-[state=active]:after:-bottom-1 data-[state=active]:after:border-b-2 data-[state=active]:after:border-current underline-offset-[14px]'
              value='offline'
            >
              Offline Payments
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='finance'>
          <div className='space-y-6'>
            <div className='space-y-3 bg-white rounded-lg shadow-md px-3 py-5'>
              <h2 className='font-lato text-base text-[#4A4A4A]'>
                Financial Report
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {revenueData.map((revenue, index) => (
                  <RevenueCard key={index} {...revenue} />
                ))}
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-md px-3 py-5'>
              <h2 className='font-lato text-base text-[#4A4A4A] mb-4'>
                Revenue by Class
              </h2>
              <div className='w-full h-[400px]'>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={classRevenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="expected" fill="#FFA07A" name="Expected Revenue" />
                    <Bar dataKey="paid" fill="#4CAF50" name="Paid Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value='students'>
          <StudentListTab />
        </TabsContent>
        <TabsContent value='invoice'>
          <InvoiceTab />
        </TabsContent>

        <TabsContent value='discount'>
          <DiscountTab />
        </TabsContent>
        <TabsContent value='payment'>
          <PaymentLogsTab />
        </TabsContent>
        <TabsContent value='offline'>
          <OfflinePaymentsTab />
        </TabsContent>
      </Tabs>
      <CustomModal
        open={openInvoiceModal}
        onOpenChange={setOpenInvoiceModal}
        type={ENUM_MODULES.INVOICE}
        status='create'
        title='Create Invoice'
        description='Fill the form to create or edit an invoice.'
      >
        <InvoiceForm onClose={() => setOpenInvoiceModal(false)} />
      </CustomModal>

      <CustomModal
        open={openDiscountModal}
        onOpenChange={setOpenDiscountModal}
        type={ENUM_MODULES.DISCOUNT}
        status='create'
        title='Create Discount'
        description='Enter the invoice reference to proceed with discount creation.'
      >
        <InvoiceReferenceForm onClose={() => setOpenDiscountModal(false)} />
      </CustomModal>
    </div>
  );
}
