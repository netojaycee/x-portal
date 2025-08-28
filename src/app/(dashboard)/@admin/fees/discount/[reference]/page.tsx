"use client";
import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Users,
  GraduationCap,
} from "lucide-react";
import {
  useGetInvoiceByCodeQuery,
  useCreateDiscountMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";

const DiscountFormSchema = z.object({
  discountAmount: z
    .number()
    .min(0.01, "Discount amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
});

type DiscountFormValues = z.infer<typeof DiscountFormSchema>;

export default function InvoiceDiscountPage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reference = Array.isArray(params?.reference)
    ? params.reference[0]
    : params?.reference;

  const decodedReference = reference ? decodeURIComponent(reference) : "";
  // console.log(decodedReference, "decodedReference");
  // Fetch invoice by code
  const {
    data: invoiceData,
    isLoading: isLoadingInvoice,
    error: invoiceError,
  } = useGetInvoiceByCodeQuery(
    { reference: decodedReference },
    {
      skip: !decodedReference,
    }
  );

  console.log(invoiceData, "invoiceData");

  const [createDiscount] = useCreateDiscountMutation();

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(DiscountFormSchema),
    defaultValues: {
      discountAmount: 0,
      dueDate: "",
    },
  });

  const invoice = useMemo(() => invoiceData, [invoiceData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onSubmit = async (values: DiscountFormValues) => {
    if (!invoice) {
      toast.error("Invoice not found");
      return;
    }

    setIsSubmitting(true);
    try {
      await createDiscount({
        invoiceId: invoice.id,
        amount: values.discountAmount,
        dueDate: new Date(values.dueDate).toISOString(),
        reason: `Discount applied to invoice ${invoice.reference}`,
      }).unwrap();

      toast.success("Discount created successfully!");
      router.push("/fees");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to create discount. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoadingInvoice) {
    return <LoaderComponent />;
  }

  if (invoiceError || !invoice) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6 text-center'>
            <h2 className='text-xl font-semibold text-red-600 mb-2'>
              Invoice Not Found
            </h2>
            <p className='text-gray-600 mb-4'>
              The invoice with reference &quot;{decodedReference}&quot; could
              not be found.
            </p>
            <Button onClick={handleGoBack} variant='outline'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center space-x-4'>
        <Button onClick={handleGoBack} variant='outline' size='sm'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back
        </Button>
        <h1 className='text-2xl font-bold'>Create Discount for Invoice</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Invoice Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <DollarSign className='w-5 h-5' />
              <span>Invoice Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-gray-500'>Reference</p>
                <p className='font-mono text-sm bg-gray-100 p-2 rounded'>
                  {invoice.reference}
                </p>
              </div>
              {/* <div>
                <p className='text-sm font-medium text-gray-500'>Status</p>
                <Badge
                  variant={invoice.status === "paid" ? "default" : "secondary"}
                  className='mt-1'
                >
                  {invoice.status}
                </Badge>
              </div> */}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-gray-500'>Title</p>
                <p className='font-semibold'>{invoice.title}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Amount</p>
                <p className='font-semibold text-lg'>
                  {formatCurrency(invoice.amount)}
                </p>
              </div>
            </div>

            {invoice.description && (
              <div>
                <p className='text-sm font-medium text-gray-500'>Description</p>
                <p className='text-sm'>{invoice.description}</p>
              </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-sm font-medium text-gray-500'>Issued Date</p>
                <p className='text-sm flex items-center'>
                  <Calendar className='w-4 h-4 mr-1' />
                  {formatDate(invoice.createdAt)}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Created By</p>
                <p className='text-sm flex items-center'>
                  <User className='w-4 h-4 mr-1' />
                  {invoice.createdByUser?.firstname}{" "}
                  {invoice.createdByUser?.lastname}
                </p>
              </div>
            </div>

            {/* Assignment Details */}
            <div className='pt-4 border-t'>
              <h4 className='font-semibold mb-3 flex items-center'>
                {invoice.invoiceType === "single" ? (
                  <>
                    <User className='w-4 h-4 mr-2' />
                    Student Assignment
                  </>
                ) : (
                  <>
                    <Users className='w-4 h-4 mr-2' />
                    Class Assignment
                  </>
                )}
              </h4>

              {invoice.invoiceType === "single" ? (
                <div className='space-y-2'>
                  <div className='bg-blue-50 p-3 rounded-lg'>
                    <p className='font-medium flex items-center'>
                      <GraduationCap className='w-4 h-4 mr-2' />
                      {
                        invoice.studentInvoiceAssignments[0]?.student?.user
                          ?.firstname
                      }{" "}
                      {
                        invoice.studentInvoiceAssignments[0]?.student?.user
                          ?.lastname
                      }
                    </p>
                    <p className='text-sm text-gray-600'>
                      {invoice?.classes[0]?.class?.name} -{" "}
                      {invoice.classArm?.name}
                    </p>
                    {invoice.studentInvoiceAssignments[0]?.student
                      ?.studentRegNo && (
                      <p className='text-xs text-gray-500'>
                        Reg:{" "}
                        {
                          invoice.studentInvoiceAssignments[0]?.student
                            ?.studentRegNo
                        }
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className='gap-2 grid grid-cols-4'>
                  {invoice.classes?.map((cls: any, index: number) => (
                    <div key={index} className='bg-green-50 p-1 rounded-lg'>
                      <p className='font-medium text-xs flex items-center'>
                        <GraduationCap className='w-4 h-4 mr-2' />
                        {cls.class.name}
                      </p>
                      {/* <p className='text-sm text-gray-600'>
                        {cls.class.classCategory} Class
                      </p> */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Discount Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='discountAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Amount (₦)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.01'
                          min='0.01'
                          max={invoice.amount}
                          {...field}
                          value={
                            field.value === undefined || field.value === null
                              ? ""
                              : field.value
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(
                              val === "" ? undefined : Number(val)
                            );
                          }}
                          placeholder='Enter discount amount'
                        />
                      </FormControl>
                      <FormMessage />
                      <p className='text-xs text-gray-500'>
                        Maximum discount: {formatCurrency(invoice.amount)}
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dueDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          {...field}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='pt-4'>
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Creating Discount...
                      </>
                    ) : (
                      "Create Discount"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
