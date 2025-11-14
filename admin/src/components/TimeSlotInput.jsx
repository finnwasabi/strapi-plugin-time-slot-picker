import { useState, useRef } from "react";
import { Button, Field, Checkbox } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { Typography } from "@strapi/design-system";
import { Flex } from "@strapi/design-system";
import { DatePicker } from "@strapi/design-system";
import { IconButton } from "@strapi/design-system";
import { Plus, Trash } from "@strapi/icons";
import styled from "styled-components";

const DateSection = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spaces[4]};
  margin-bottom: ${({ theme }) => theme.spaces[4]};
  background: transparent;
`;

const DateHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaces[4]};
  padding-bottom: ${({ theme }) => theme.spaces[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const SlotsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spaces[6]};
`;

const SlotColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaces[2]};
`;

const SlotLabel = styled(Box)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spaces[2]} ${({ theme }) => theme.spaces[3]};
  background: ${({ theme, checked }) =>
    checked ? theme.colors.primary100 : "transparent"};
  border: 1px solid
    ${({ theme, checked }) =>
      checked ? theme.colors.primary600 : theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s;
  min-height: 40px;
  gap: ${({ theme }) => theme.spaces[2]};

  &:hover {
    background: ${({ theme, checked }) =>
      checked ? theme.colors.primary200 : theme.colors.neutral150};
    border-color: ${({ theme, checked }) =>
      checked ? theme.colors.primary600 : theme.colors.neutral300};
  }
`;

const TimeSlotInput = ({
  name,
  value,
  onChange,
  intlLabel,
  required,
  error,
  attribute,
}) => {
  const DEFAULT_MORNING = [
    "8:00-9:00",
    "9:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
  ];

  const DEFAULT_AFTERNOON = [
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
  ];

  const config = useRef({
    morningSlots: attribute?.options?.morningSlots
      ? attribute.options.morningSlots
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : DEFAULT_MORNING,
    afternoonSlots: attribute?.options?.afternoonSlots
      ? attribute.options.afternoonSlots
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : DEFAULT_AFTERNOON,
  }).current;

  const parseInitialValue = () => {
    if (!value) return { selectedDates: [], dateSlots: {} };

    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      const dateSlots = {};
      const selectedDates = [];

      if (parsed?.days) {
        parsed.days.forEach((day) => {
          selectedDates.push(day.date);
          dateSlots[day.date] = day.slots || [];
        });
      }

      return { selectedDates, dateSlots };
    } catch (e) {
      return { selectedDates: [], dateSlots: {} };
    }
  };

  const initialData = useRef(parseInitialValue()).current;
  const [selectedDates, setSelectedDates] = useState(initialData.selectedDates);
  const [dateSlots, setDateSlots] = useState(initialData.dateSlots);
  const [newDate, setNewDate] = useState(null);

  const handleDateChange = (date) => {
    setNewDate(date);
  };

  const handleChange = (dates, slots) => {
    const days = dates.map((date) => ({
      date,
      slots: slots[date] || [],
    }));

    const jsonValue = JSON.stringify({ days });
    onChange({ target: { name, value: jsonValue, type: "json" } });
  };

  const addDate = () => {
    if (!newDate) return;

    // Use LOCAL timezone methods (getFullYear, getMonth, getDate) not UTC
    let dateStr;
    if (typeof newDate === "string") {
      dateStr = newDate.split("T")[0];
    } else if (newDate instanceof Date) {
      // Use LOCAL timezone to get the date user actually selected
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0");
      const day = String(newDate.getDate()).padStart(2, "0");
      dateStr = `${year}-${month}-${day}`;
    } else {
      dateStr = String(newDate).split("T")[0];
    }

    if (selectedDates.includes(dateStr)) {
      setNewDate(null);
      return;
    }

    const newSelectedDates = [...selectedDates, dateStr];
    const newDateSlots = { ...dateSlots, [dateStr]: [] };

    setSelectedDates(newSelectedDates);
    setDateSlots(newDateSlots);
    setNewDate(null);

    handleChange(newSelectedDates, newDateSlots);
  };

  const removeDate = (date) => {
    const newSelectedDates = selectedDates.filter((d) => d !== date);
    const newDateSlots = { ...dateSlots };
    delete newDateSlots[date];

    setSelectedDates(newSelectedDates);
    setDateSlots(newDateSlots);

    handleChange(newSelectedDates, newDateSlots);
  };

  const toggleSlot = (date, slot) => {
    const slots = dateSlots[date] || [];
    const isSelected = slots.includes(slot);

    const newSlots = isSelected
      ? slots.filter((s) => s !== slot)
      : [...slots, slot];

    const newDateSlots = {
      ...dateSlots,
      [date]: newSlots,
    };

    setDateSlots(newDateSlots);
    handleChange(selectedDates, newDateSlots);
  };

  const toggleAllSlots = (date) => {
    const allSlots = [...config.morningSlots, ...config.afternoonSlots];
    const currentSlots = dateSlots[date] || [];
    const allSelected = allSlots.every((slot) => currentSlots.includes(slot));

    const newDateSlots = {
      ...dateSlots,
      [date]: allSelected ? [] : allSlots,
    };

    setDateSlots(newDateSlots);
    handleChange(selectedDates, newDateSlots);
  };

  const isSlotSelected = (date, slot) => {
    return dateSlots[date]?.includes(slot) || false;
  };

  const isAllSelected = (date) => {
    const allSlots = [...config.morningSlots, ...config.afternoonSlots];
    const currentSlots = dateSlots[date] || [];
    return (
      allSlots.length > 0 &&
      allSlots.every((slot) => currentSlots.includes(slot))
    );
  };

  const formatDateLabel = (dateStr) => {
    try {
      const date = new Date(dateStr + "T00:00:00");
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      return `${dayName}, ${monthName} ${day}, ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Field.Root name={name} required={required} error={error}>
      <Field.Label>
        {intlLabel?.id ? intlLabel.defaultMessage : intlLabel || name}
      </Field.Label>

      <Box paddingTop={2} paddingBottom={4}>
        <Typography variant="pi" textColor="neutral600">
          If do not want to participate in any slot, please uncheck it.
        </Typography>
      </Box>

      <Box paddingBottom={4}>
        <Flex gap={2} alignItems="flex-end">
          <Box style={{ flex: 1 }}>
            <DatePicker
              placeholder="Select a date to add"
              selectedDate={newDate}
              onChange={handleDateChange}
              clearLabel="Clear"
              onClear={() => setNewDate(null)}
            />
          </Box>
          <IconButton
            onClick={addDate}
            disabled={!newDate}
            label="Add date"
            size="L"
            variant="default"
          >
            <Plus />
          </IconButton>
        </Flex>
      </Box>

      {selectedDates.length === 0 && (
        <Box paddingTop={2} paddingBottom={4}>
          <Typography variant="omega" textColor="neutral500">
            No dates selected. Please add a date to select time slots.
          </Typography>
        </Box>
      )}

      {selectedDates.map((date) => (
        <DateSection key={date}>
          <DateHeader>
            <Flex gap={2} alignItems="center">
              <Checkbox
                checked={isAllSelected(date)}
                onCheckedChange={() => toggleAllSlots(date)}
              />
              <Typography fontWeight="bold">{formatDateLabel(date)}</Typography>
            </Flex>
            <IconButton onClick={() => removeDate(date)} label="Remove date">
              <Trash />
            </IconButton>
          </DateHeader>

          <SlotsContainer>
            <SlotColumn>
              <Typography
                variant="sigma"
                textColor="neutral800"
                fontWeight="semiBold"
                style={{ marginBottom: "8px" }}
              >
                MORNING
              </Typography>
              {config.morningSlots.map((slot) => (
                <SlotLabel key={slot} checked={isSlotSelected(date, slot)}>
                  <Checkbox
                    checked={isSlotSelected(date, slot)}
                    onCheckedChange={() => toggleSlot(date, slot)}
                  />
                  <Typography variant="omega">{slot}</Typography>
                </SlotLabel>
              ))}
            </SlotColumn>

            <SlotColumn>
              <Typography
                variant="sigma"
                textColor="neutral800"
                fontWeight="semiBold"
                style={{ marginBottom: "8px" }}
              >
                AFTERNOON
              </Typography>
              {config.afternoonSlots.map((slot) => (
                <SlotLabel key={slot} checked={isSlotSelected(date, slot)}>
                  <Checkbox
                    checked={isSlotSelected(date, slot)}
                    onCheckedChange={() => toggleSlot(date, slot)}
                  />
                  <Typography variant="omega">{slot}</Typography>
                </SlotLabel>
              ))}
            </SlotColumn>
          </SlotsContainer>
        </DateSection>
      ))}

      <Box paddingTop={2}>
        <Typography variant="pi" textColor="neutral600">
          * Timezone: Asia / Ho Chi Minh (GMT +7:00)
        </Typography>
      </Box>

      <Field.Error />
    </Field.Root>
  );
};

export default TimeSlotInput;
