
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SimulationParameters } from "@/types/simulationTypes";
import { formatPercentage } from "@/utils/simulationUtils";

interface PhishingSimulatorProps {
  initialParams: SimulationParameters;
  onUpdate: (params: SimulationParameters) => void;
}

const PhishingSimulator = ({ initialParams, onUpdate }: PhishingSimulatorProps) => {
  const form = useForm<SimulationParameters>({
    defaultValues: initialParams,
  });

  const handleSubmit = (values: SimulationParameters) => {
    onUpdate(values);
  };

  // Update simulation when slider values change
  const handleSliderChange = (name: keyof SimulationParameters, value: number) => {
    form.setValue(name, value);
    handleSubmit(form.getValues());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phishing Simulator</CardTitle>
        <CardDescription>
          Adjust parameters to simulate different scenarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phishingRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span>Phishing Incidence Rate</span>
                    <span className="font-normal text-gray-500">
                      {formatPercentage(field.value)}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0.01}
                      max={0.5}
                      step={0.01}
                      defaultValue={[field.value]}
                      onValueChange={(values) => handleSliderChange("phishingRate", values[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage of employees who receive phishing emails
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clickThroughRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span>Click-Through Rate</span>
                    <span className="font-normal text-gray-500">
                      {formatPercentage(field.value)}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0.01}
                      max={0.8}
                      step={0.01}
                      defaultValue={[field.value]}
                      onValueChange={(values) => handleSliderChange("clickThroughRate", values[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage of recipients who click phishing links
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compromiseRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span>Compromise Rate</span>
                    <span className="font-normal text-gray-500">
                      {formatPercentage(field.value)}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0.01}
                      max={0.9}
                      step={0.01}
                      defaultValue={[field.value]}
                      onValueChange={(values) => handleSliderChange("compromiseRate", values[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage of clicks that result in compromise
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Update Simulation
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PhishingSimulator;
