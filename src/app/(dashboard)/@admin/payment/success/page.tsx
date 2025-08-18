"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerifyPaymentMutation } from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { formatDate, formatDateTime, formatCurrency } from "@/lib/dateUtils";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "failed"
  >("loading");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [verifyPayment] = useVerifyPaymentMutation();

  const reference = searchParams.get("reference");

  useEffect(() => {
    if (reference) {
      verifyPaymentTransaction(reference);
    } else {
      setVerificationStatus("failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  const verifyPaymentTransaction = async (ref: string) => {
    try {
      const result = await verifyPayment({ reference: ref }).unwrap();

      if (result.message && result.data) {
        setVerificationStatus("success");
        setPaymentDetails(result.data);
      } else {
        setVerificationStatus("failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setVerificationStatus("failed");
    }
  };

  if (verificationStatus === "loading") {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <LoaderComponent />
        <p className='mt-4 text-gray-600'>Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Breadcrumb Navigation */}
      <div className='flex items-center space-x-0 text-sm mb-3'>
        <span className='cursor-pointer flex items-center'>
          <ChevronLeft className='h-4 w-4 text-primary' />
          <Link href='/dashboard/@admin/payment' className='text-primary'>
            Payment
          </Link>
        </span>
        <span>/</span>
        <p className='text-gray-500'>Payment Status</p>
      </div>

      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Payment Status</h1>
      </div>

      <Card
        className={`${
          verificationStatus === "success"
            ? "border-green-500"
            : "border-red-500"
        }`}
      >
        <CardHeader
          className={`flex flex-row items-center gap-2 ${
            verificationStatus === "success" ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {verificationStatus === "success" ? (
            <CheckCircle className='h-6 w-6 text-green-500' />
          ) : (
            <AlertCircle className='h-6 w-6 text-red-500' />
          )}
          <CardTitle className='text-lg'>
            {verificationStatus === "success"
              ? "Payment Successful"
              : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          {verificationStatus === "success" ? (
            <div className='space-y-4'>
              <p className='text-green-700'>
                Your subscription payment was successfully processed. Your
                account has been updated.
              </p>

              {paymentDetails && (
                <div className='space-y-2 mt-4 text-sm'>
                  <div className='flex justify-between border-b pb-2'>
                    <span className='text-gray-500'>Reference:</span>
                    <span className='font-medium'>
                      {paymentDetails.payment?.reference}
                    </span>
                  </div>
                  <div className='flex justify-between border-b pb-2'>
                    <span className='text-gray-500'>Package:</span>
                    <span className='font-medium'>
                      {paymentDetails.payment?.subscription?.name ||
                        "Subscription Package"}
                    </span>
                  </div>
                  <div className='flex justify-between border-b pb-2'>
                    <span className='text-gray-500'>Amount:</span>
                    <span className='font-medium'>
                      ₦{formatCurrency(paymentDetails.payment?.amount)}
                    </span>
                  </div>
                  <div className='flex justify-between border-b pb-2'>
                    <span className='text-gray-500'>Date:</span>
                    <span className='font-medium'>
                      {formatDateTime(paymentDetails.payment?.paymentDate)}
                    </span>
                  </div>
                  <div className='flex justify-between border-b pb-2'>
                    <span className='text-gray-500'>Status:</span>
                    <span className='font-medium text-green-600'>
                      {paymentDetails.status === "already_processed"
                        ? "Successfully Processed"
                        : paymentDetails.payment?.paymentStatus || "Completed"}
                    </span>
                  </div>
                  <div className='flex justify-between border-b pb-2'>
                    <span className='text-gray-500'>School:</span>
                    <span className='font-medium'>
                      {paymentDetails.school?.name || "N/A"}
                    </span>
                  </div>
                  {paymentDetails.school?.subscriptionExpiresAt && (
                    <div className='flex justify-between border-b pb-2'>
                      <span className='text-gray-500'>
                        Subscription Expires:
                      </span>
                      <span className='font-medium'>
                        {formatDate(
                          paymentDetails.school.subscriptionExpiresAt
                        )}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between border-b pb-2'>
                    <span className='text-gray-500'>Student Limit:</span>
                    <span className='font-medium'>
                      {formatCurrency(
                        paymentDetails.payment?.subscription?.studentLimit
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between border-b pb-2'>
                    <span className='text-gray-500'>Duration:</span>
                    <span className='font-medium'>
                      {paymentDetails.payment?.subscription?.duration
                        ? `${
                            paymentDetails.payment.subscription.duration
                          } month${
                            paymentDetails.payment.subscription.duration > 1
                              ? "s"
                              : ""
                          }`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              )}

              <div className='flex justify-center pt-4'>
                <Button asChild>
                  <Link href='/dashboard'>Return to Dashboard</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              <p className='text-red-700'>
                We couldn&apos;t verify your payment. If you believe this is an
                error, please contact support.
              </p>
              <div className='flex justify-center pt-4 space-x-4'>
                <Button
                  variant='outline'
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Button asChild>
                  <Link href='/dashboard'>Return to Dashboard</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
