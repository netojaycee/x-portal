"use client";
import React, { useState } from "react";
import { ChevronLeft, Check, AlertTriangle, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  // useGetSubscriptionPackagesQuery,
  useCreatePaymentMutation,
  // useGetCurrentSubscriptionQuery,
} from "@/redux/api";
// import LoaderComponent from "@/components/local/LoaderComponent";
import CustomCheckout from "./(components)/CustomCheckout";

export default function Payment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showCustomCheckout, setShowCustomCheckout] = useState(false);
  const [selectedPackageDetails, setSelectedPackageDetails] =
    useState<any>(null);

  // const { data: packagesData, isLoading: packagesLoading } =
  //   useGetSubscriptionPackagesQuery();
  // const { data: currentSubscription, isLoading: subscriptionLoading } =
  //   useGetCurrentSubscriptionQuery();
  const [createPayment] = useCreatePaymentMutation();

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);

    // Find the package details
    const selectedPkg = subscriptionPackages.find(
      (pkg) => pkg.id === packageId
    );
    if (selectedPkg) {
      setSelectedPackageDetails(selectedPkg);
    }
  };

  const handlePayment = async () => {
    if (!selectedPackage) {
      toast.error("Please select a subscription package");
      return;
    }

    try {
      setIsProcessing(true);
      const result = await createPayment({
        packageId: selectedPackage,
        customCheckout: false, // Use Paystack's standard checkout
      }).unwrap();

      // Redirect to the Paystack payment page
      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      } else {
        toast.error("Could not initialize payment");
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || "Failed to process payment";
      toast.error(errorMessage);
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomCheckout = () => {
    if (!selectedPackage) {
      toast.error("Please select a subscription package");
      return;
    }
    setShowCustomCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    toast.success("Payment successful!");
    setShowCustomCheckout(false);
    // Redirect to success page
    window.location.href =
      "/payment/success?reference=custom_checkout_" + Date.now();
  };

  const handleCheckoutCancel = () => {
    setShowCustomCheckout(false);
  };

  // if (packagesLoading || subscriptionLoading) {
  //   return <LoaderComponent />;
  // }

  // Mock data for development
  const subscriptionPackages = [
    {
      id: "1",
      name: "Basic",
      price: 10000,
      validity: 30, // in days
      features: [
        "Up to 100 students",
        "Basic report templates",
        "Email support",
      ],
      isPopular: false,
    },
    {
      id: "2",
      name: "Standard",
      price: 25000,
      validity: 90, // in days
      features: [
        "Up to 500 students",
        "Advanced report templates",
        "Email & chat support",
        "Customizable dashboards",
        "Export to PDF/Excel",
      ],
      isPopular: true,
    },
    {
      id: "3",
      name: "Premium",
      price: 50000,
      validity: 365, // in days
      features: [
        "Unlimited students",
        "All report templates",
        "Priority support",
        "Advanced analytics",
        "API access",
        "Bulk operations",
        "White-labeling",
      ],
      isPopular: false,
    },
  ];

  // Current subscription info
  const currentSubscriptionInfo = {
    packageId: "2", // Standard package
    expiresAt: "2025-09-10",
    isActive: true,
  };

  return (
    <div className='space-y-4'>
      {/* Breadcrumb Navigation */}
      <div className='flex items-center space-x-0 text-sm mb-3'>
        <span className='cursor-pointer flex items-center'>
          <ChevronLeft className='h-4 w-4 text-primary' />
          <Link href='/dashboard' className='text-primary'>
            Dashboard
          </Link>
        </span>
        <span>/</span>
        <p className='text-gray-500'>Subscription & Payment</p>
      </div>

      {/* Header */}
      <div>
        <h1 className='text-2xl font-semibold'>Subscription Packages</h1>
        <p className='text-gray-500 mt-1'>
          Choose a subscription plan that fits your school&apos;s needs
        </p>
      </div>

      {/* Current Subscription Info */}
      {currentSubscriptionInfo && (
        <Card className='bg-blue-50 border-blue-200'>
          <CardHeader>
            <CardTitle className='text-lg'>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium text-lg'>
                  {subscriptionPackages.find(
                    (pkg) => pkg.id === currentSubscriptionInfo.packageId
                  )?.name || "Unknown Package"}
                </p>
                <p className='text-sm text-gray-600'>
                  Expires:{" "}
                  {new Date(
                    currentSubscriptionInfo.expiresAt
                  ).toLocaleDateString()}
                </p>
              </div>
              <Badge
                variant={
                  currentSubscriptionInfo.isActive ? "default" : "destructive"
                }
              >
                {currentSubscriptionInfo.isActive ? "Active" : "Expired"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Packages */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {subscriptionPackages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`
              flex flex-col
              ${
                pkg.id === currentSubscriptionInfo?.packageId
                  ? "border-primary ring-1 ring-primary"
                  : ""
              }
              ${pkg.isPopular ? "shadow-lg" : ""}
            `}
          >
            {pkg.isPopular && (
              <div className='bg-primary text-white text-center py-1 text-xs font-medium'>
                MOST POPULAR
              </div>
            )}
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription>{pkg.validity} days validity</CardDescription>
              <div className='mt-2'>
                <span className='text-3xl font-bold'>
                  ₦{pkg.price.toLocaleString()}
                </span>
              </div>
            </CardHeader>
            <CardContent className='flex-grow'>
              <h4 className='font-medium mb-2'>Features:</h4>
              <ul className='space-y-2'>
                {pkg.features.map((feature, index) => (
                  <li key={index} className='flex items-center'>
                    <Check className='h-4 w-4 text-green-500 mr-2' />
                    <span className='text-sm'>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSelectPackage(pkg.id)}
                className={`w-full ${
                  selectedPackage === pkg.id ? "bg-primary" : "bg-secondary"
                }`}
                disabled={
                  pkg.id === currentSubscriptionInfo?.packageId &&
                  currentSubscriptionInfo?.isActive
                }
              >
                {pkg.id === currentSubscriptionInfo?.packageId &&
                currentSubscriptionInfo?.isActive
                  ? "Current Plan"
                  : selectedPackage === pkg.id
                  ? "Selected"
                  : "Select Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payment Action */}
      <div className='flex justify-end mt-6 gap-4'>
        <Button
          variant='outline'
          onClick={handleCustomCheckout}
          disabled={!selectedPackage || isProcessing || showCustomCheckout}
          size='lg'
        >
          <CreditCard className='mr-2 h-4 w-4' />
          Use Custom Checkout
        </Button>
        <Button
          onClick={handlePayment}
          disabled={!selectedPackage || isProcessing || showCustomCheckout}
          size='lg'
        >
          {isProcessing ? "Processing..." : "Proceed with Paystack"}
        </Button>
      </div>

      {/* Payment Info */}
      {!showCustomCheckout && (
        <Card className='mt-4 bg-amber-50 border-amber-200'>
          <CardHeader className='flex flex-row items-center gap-2'>
            <AlertTriangle className='h-5 w-5 text-amber-500' />
            <CardTitle className='text-lg'>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm'>
              This payment will be processed securely through Paystack. After
              successful payment, your subscription will be automatically
              activated. For any payment issues, please contact support.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Custom Checkout */}
      {showCustomCheckout && selectedPackageDetails && (
        <div className='mt-8'>
          <CustomCheckout
            packageId={selectedPackageDetails.id}
            packageName={selectedPackageDetails.name}
            packagePrice={selectedPackageDetails.price}
            onSuccess={handleCheckoutSuccess}
            onCancel={handleCheckoutCancel}
          />
        </div>
      )}
    </div>
  );
}
