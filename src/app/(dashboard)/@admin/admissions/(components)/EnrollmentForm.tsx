"use client"
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetClassClassArmsBySessionIdQuery,
  useManageAdmissionMutation,
} from "@/redux/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EnrollmentFormSchema = z.object({
  classId: z.string().min(1, "Please select a class"),
  classArmId: z.string().min(1, "Please select a class arm"),
});

type EnrollmentFormValues = z.infer<typeof EnrollmentFormSchema>;

interface EnrollmentFormProps {
  admission: any;
  onSuccess: () => void;
}

export function EnrollmentForm({ admission, onSuccess }: EnrollmentFormProps) {
  const [availableArms, setAvailableArms] = useState<
    { id: string; name: string }[]
  >([]);

  // Fetch classes and arms data using the session ID from the admission
  const { data: classData, isLoading: classDataLoading } =
    useGetClassClassArmsBySessionIdQuery(admission?.sessionId, {
      skip: !admission?.sessionId,
    });
  const [approveAdmission, { isLoading }] = useManageAdmissionMutation();

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(EnrollmentFormSchema),
    defaultValues: {
      classId: "",
      classArmId: "",
    },
  });

  // When class selection changes, update available arms
  const handleClassChange = (classId: string) => {
    form.setValue("classId", classId);
    form.setValue("classArmId", ""); // Reset arm selection

    // Find the selected class and update available arms
    const selectedClass = classData?.data?.classes?.find(
      (cls: any) => cls.id === classId
    );

    if (selectedClass) {
      setAvailableArms(selectedClass.classArms || []);
    } else {
      setAvailableArms([]);
    }
  };

  const onSubmit = async (values: EnrollmentFormValues) => {
    try {
      await approveAdmission({
        id: admission.id,
        status: "accepted",
        classId: values.classId,
        classArmId: values.classArmId,
      }).unwrap();

      toast.success("Admission approved successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error approving admission:", error);
      toast.error("Failed to approve admission. Please try again.");
    }
  };

  return (
    <Form {...form}>
      {classDataLoading && (
        <Loader2 className='animate-spin w-5 h-5 text-primary' />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='classId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Class</FormLabel>
              <Select
                onValueChange={(value) => handleClassChange(value)}
                value={field.value}
                disabled={classDataLoading || isLoading}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select class' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classDataLoading ? (
                    <SelectItem value='loading' disabled>
                      Loading classes...
                    </SelectItem>
                  ) : classData?.data?.classes?.length ? (
                    classData.data.classes.map(
                      (cls: {
                        id: Key | null | undefined;
                        name:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                      }) => (
                        <SelectItem
                          key={cls.id?.toString()}
                          value={String(cls.id)}
                        >
                          {cls.name}
                        </SelectItem>
                      )
                    )
                  ) : (
                    <SelectItem value='empty' disabled>
                      No classes available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='classArmId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Class Arm</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!form.getValues("classId") || isLoading}
              >
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select class arm' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!form.getValues("classId") ? (
                    <SelectItem value='select-class-first' disabled>
                      Select a class first
                    </SelectItem>
                  ) : availableArms.length > 0 ? (
                    availableArms.map((arm) => (
                      <SelectItem key={arm.id} value={arm.id}>
                        {arm.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='no-arms' disabled>
                      No class arms available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end pt-4'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? "Processing..." : "Enroll Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
