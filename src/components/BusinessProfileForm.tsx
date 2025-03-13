
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { industryRiskFactors } from "@/types/businessTypes";
import { BusinessProfile } from "@/types/businessTypes";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  employeeCount: z.coerce.number().int().positive({
    message: "Employee count must be a positive number.",
  }),
  annualRevenue: z.coerce.number().positive({
    message: "Annual revenue must be a positive number.",
  }),
  dataImportance: z.number().min(1).max(10),
  techMaturity: z.number().min(1).max(10),
  averageSalary: z.coerce.number().positive({
    message: "Average salary must be a positive number.",
  }),
  criticalSystemsCount: z.coerce.number().int().positive({
    message: "Critical systems count must be a positive number.",
  }),
});

// This ensures the form schema matches the BusinessProfile type
type FormValues = z.infer<typeof formSchema>;

interface BusinessProfileFormProps {
  onSubmit: (data: BusinessProfile) => void;
}

const BusinessProfileForm = ({ onSubmit }: BusinessProfileFormProps) => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      industry: "Technology",
      employeeCount: 50,
      annualRevenue: 5000000,
      dataImportance: 7,
      techMaturity: 6,
      averageSalary: 75000,
      criticalSystemsCount: 5,
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Since we're using Zod validation, we know all required fields are present
    // So we can safely cast the form values to BusinessProfile type
    const businessProfileData: BusinessProfile = {
      companyName: values.companyName,
      industry: values.industry,
      employeeCount: values.employeeCount,
      annualRevenue: values.annualRevenue,
      dataImportance: values.dataImportance,
      techMaturity: values.techMaturity,
      averageSalary: values.averageSalary,
      criticalSystemsCount: values.criticalSystemsCount,
    };
    
    onSubmit(businessProfileData);
    setSubmitted(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>
          Enter your business details to calculate phishing risk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industryRiskFactors.map((industry) => (
                        <SelectItem key={industry.industry} value={industry.industry}>
                          {industry.industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Count</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualRevenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Revenue ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dataImportance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Sensitivity (1-10)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                      <div className="text-center font-medium">{field.value}</div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    How sensitive or valuable is your business data?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="techMaturity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technology Maturity (1-10)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Basic</span>
                        <span>Advanced</span>
                      </div>
                      <div className="text-center font-medium">{field.value}</div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    How mature are your security systems and practices?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="averageSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Salary ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="criticalSystemsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Critical Systems</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              {submitted ? "Update Profile" : "Calculate Risk"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BusinessProfileForm;
