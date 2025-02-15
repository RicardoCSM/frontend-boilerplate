"use client";

import { useRef, useState } from "react";
import { DashboardTab } from "../../Interfaces/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatePickerWithRange from "@/components/ui/date-range";
import { DateRange } from "../../Interfaces/DateRange";
import { Filter } from "../../Interfaces/Filter";
import { FilterList } from "../RootLayout/_partials/FilterList";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DashboardProps {
  tabs: DashboardTab[];
  defaultTab?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ tabs, defaultTab }) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTab, setSelectedTab] = useState<DashboardTab>(
    tabs.find((tab) => tab.value === defaultTab) || tabs[0],
  );
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (dashboardRef.current) {
      html2canvas(dashboardRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, "image-with-background.png");
          }
        });
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 space-y-4">
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-2">
        <h2 className="text-4xl text-tenant-primary font-bold tracking-tight text-center">
          {selectedTab?.title}
        </h2>
        <div className="flex flex-col lg:flex-row gap-4 md:gap-2 items-center p-2">
          <DatePickerWithRange
            setDateRange={setDateRange}
            input={false}
            disabled={isLoading}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
          />
          <div className="flex gap-2">
            {selectedTab?.filterTypes && filters && (
              <FilterList
                filterTypes={selectedTab.filterTypes}
                filters={filters}
                setFilters={setFilters}
                isLoading={isLoading}
              />
            )}
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>
      <Tabs
        defaultValue={selectedTab.value}
        onValueChange={(value: string) => {
          const tab = tabs.find((tab) => tab.value === value);
          if (tab) {
            setDateRange(undefined);
            setFilters([]);
            setSelectedTab(tab);
          }
        }}
        className="space-y-4"
      >
        {tabs.length > 1 && (
          <TabsList className="w-full md:w-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                className="w-full md:w-auto"
                key={tab.value}
                value={tab.value}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="flex flex-col space-y-4 pb-4" ref={dashboardRef}>
              <tab.component
                loading={{
                  isLoading,
                  setIsLoading,
                }}
                dateRange={dateRange}
                filters={filters}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;
