"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersistentTab } from "@/hooks/usePersistentTab";
import FeesHeaderCard from "./(components)/FeesHeaderCard";
import { CustomModal } from "../../components/modals/CustomModal";
import { ENUM_MODULES } from "@/lib/types/enums";
import InvoiceForm from "./(components)/InvoiceForm";
import InvoiceReferenceForm from "./(components)/InvoiceReferenceForm";
import InvoiceTab from "./(components)/InvoiceTab";
import DiscountTab from "./(components)/DiscountTab";
import PaymentLogsTab from "./(components)/PaymentLogsTab";
import StudentListTab from "./(components)/StudentListTab";
import OfflinePaymentsTab from "./(components)/OfflinePaymentsTab";
import { useGetSessionsQuery } from "@/redux/api";
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

  // Show loading state if sessions are being fetched
  if (isLoadingSessions) {
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
        <TabsContent value='finance'>finance content</TabsContent>
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
