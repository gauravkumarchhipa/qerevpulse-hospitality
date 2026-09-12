import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "../ui/card";
import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";

const hotelRoomData = [
  {
    name: "The Palm - Atlantis",
    deluxe: 3500,
    double: 2147,
    single: 2147,
    suite: 4919,
  },
  {
    name: "Sofitel Dubai Downtown",
    deluxe: 1500,
    double: 1238,
    single: 1238,
    suite: 1500,
  },
  {
    name: "Riviera Hotel",
    deluxe: 303,
    double: 206,
    single: 206,
    suite: 428,
  },
  {
    name: "Radisson Blu Hotel, Dubai Deira Creek",
    deluxe: 576,
    double: 353,
    single: 353,
    suite: 800,
  },
  {
    name: "Hotel Indigo Dubai Downtown",
    deluxe: 500,
    double: 279,
    single: 279,
    suite: 1000,
  },
  {
    name: "Delta Hotels by Marriott Jumeirah Beach",
    deluxe: 1500,
    double: 1280,
    single: 1280,
    suite: 2000,
  },
];

export default function HotelRoomPricingTable() {
  const [sliderValue, setSliderValue] = useState([0]);

  const [data, setData] = useState(hotelRoomData);

  useEffect(() => {
    const percent = sliderValue[0]; // slider percentage
    const newData = [...hotelRoomData];
    const lastIndex = newData.length - 1;

    // Adjust last row values based on slider %
    const lastHotel = { ...hotelRoomData[lastIndex] };
    newData[lastIndex] = {
      ...lastHotel,
      deluxe: Math.round(lastHotel.deluxe * (1 + percent / 100)),
      double: Math.round(lastHotel.double * (1 + percent / 100)),
      single: Math.round(lastHotel.single * (1 + percent / 100)),
      suite: Math.round(lastHotel.suite * (1 + percent / 100)),
    };

    setData(newData);
  }, [sliderValue]);

  return (
    <Card className="p-4">
      <div className="flex md:flex-row flex-col md:justify-between md:items-center mb-4">
        <h2 className="text-base font-medium text-black dark:text-white">
          Expense Categories
        </h2>

        <div className="flex sm:flex-row flex-col gap-2 justify-between">
          <div className="font-medium">Utilization Adjustment(%) </div>
          <div className="flex">
            <span className="font-medium mx-2">{sliderValue}</span>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-[200px] h-5"
              value={sliderValue}
              onValueChange={setSliderValue}
              min={-50}
              max={50}
              step={5}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-[4px]">
                <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white border border-gray-400 rounded-full shadow focus:outline-none"
                aria-label="Slider Handle"
              />
            </Slider.Root>
          </div>
        </div>
      </div>

      <div className="max-h-[450px] border rounded-md bg-white dark:bg-black  overflow-auto relative">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="sticky top-0 z-50 bg-blue-100 dark:bg-blue-900">
              <TableHead className="text-black dark:text-white">
                Hotel Name
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Deluxe Room
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Double Room
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Single Room
              </TableHead>
              <TableHead className="text-right text-black dark:text-white">
                Suite
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((hotel, index) => (
              <TableRow
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-black"
                    : "bg-gray-100 dark:bg-blue-950"
                }
              >
                <TableCell className="font-medium">{hotel.name}</TableCell>
                <TableCell className="text-right">{hotel.deluxe}</TableCell>
                <TableCell className="text-right">{hotel.double}</TableCell>
                <TableCell className="text-right">{hotel.single}</TableCell>
                <TableCell className="text-right">{hotel.suite}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
