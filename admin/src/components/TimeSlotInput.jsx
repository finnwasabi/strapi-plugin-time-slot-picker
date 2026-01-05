import { Checkbox, Field, Grid } from '@strapi/design-system';
import { Box } from '@strapi/design-system';
import { Typography } from '@strapi/design-system';
import { Flex } from '@strapi/design-system';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

const DateSection = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spaces[4]};
  background: transparent;
  width: 100%;
`;

const DateHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaces[4]};
  padding-bottom: ${({ theme }) => theme.spaces[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const SlotLabel = styled(Box)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spaces[2]} ${({ theme }) => theme.spaces[3]};
  background: ${({ theme, checked }) =>
    checked ? theme.colors.primary100 : 'transparent'};
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
  label,
  required,
  error,
  attribute,
}) => {
  const { formatMessage } = useIntl();
  const DEFAULT_MORNING = [
    '8:00-9:00',
    '9:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
  ];

  const DEFAULT_AFTERNOON = [
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
  ];

  const config = useRef({
    morningSlots: attribute?.options?.morningSlots
      ? attribute.options.morningSlots
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
      : DEFAULT_MORNING,
    afternoonSlots: attribute?.options?.afternoonSlots
      ? attribute.options.afternoonSlots
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
      : DEFAULT_AFTERNOON,
  }).current;

  const parseInitialValue = () => {
    if (!value) return { selectedDates: [], dateSlots: {} };

    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      const dateSlots = {};
      const selectedDates = [];

      if (parsed?.days) {
        parsed.days.forEach((day) => {
          selectedDates.push(day.date);
          dateSlots[day.date] = day.slots || [];
        });
      }

      return { selectedDates, dateSlots };
    } catch {
      return { selectedDates: [], dateSlots: {} };
    }
  };

  const initialData = parseInitialValue();
  const selectedDates = initialData.selectedDates;
  const [dateSlots, setDateSlots] = useState(initialData.dateSlots);

  const handleChange = (dates, slots) => {
    const days = dates.map((date) => ({
      date,
      slots: slots[date] || [],
    }));

    const jsonValue = JSON.stringify({ days });
    onChange({ target: { name, value: jsonValue, type: 'json' } });
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
      const date = new Date(dateStr + 'T00:00:00');
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ];

      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      return `${dayName}, ${monthName} ${day}, ${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <Field.Root name={name} required={required} error={error}>
      <Field.Label marginBottom={1}>
        {intlLabel?.id ? formatMessage(intlLabel) : label || name}
      </Field.Label>

      {selectedDates.length === 0 && (
        <Box paddingTop={2} paddingBottom={4}>
          <Typography variant="omega" textColor="neutral500">
            No dates selected. Please add a date to select time slots.
          </Typography>
        </Box>
      )}

      <Grid.Root
        gap={{
          large: 5,
          medium: 2,
          initial: 1,
        }}
      >
        {selectedDates.map((date) => (
          <Grid.Item key={date} col={6} s={12}>
            <DateSection>
              <DateHeader>
                <Flex gap={2} alignItems="center">
                  <Checkbox
                    checked={isAllSelected(date)}
                    onCheckedChange={() => toggleAllSlots(date)}
                  />
                  <Typography fontWeight="bold">
                    {formatDateLabel(date)}
                  </Typography>
                </Flex>
              </DateHeader>

              <Flex direction="column" gap={3} alignItems="unset">
                <Flex direction="column" gap={1} alignItems="unset">
                  <Typography
                    variant="sigma"
                    textColor="neutral800"
                    fontWeight="semiBold"
                    textAlign="center"
                  >
                    MORNING
                  </Typography>
                  {config.morningSlots.map((slot) => (
                    <SlotLabel
                      key={slot}
                      checked={isSlotSelected(date, slot)}
                      onClick={() => toggleSlot(date, slot)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleSlot(date, slot);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSlotSelected(date, slot)}
                    >
                      <button onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSlotSelected(date, slot)}
                          onCheckedChange={() => toggleSlot(date, slot)}
                        />
                      </button>
                      <Typography variant="omega">{slot}</Typography>
                    </SlotLabel>
                  ))}
                </Flex>

                <Flex direction="column" gap={1} alignItems="unset">
                  <Typography
                    variant="sigma"
                    textColor="neutral800"
                    fontWeight="semiBold"
                    textAlign="center"
                  >
                    AFTERNOON
                  </Typography>
                  {config.afternoonSlots.map((slot) => (
                    <SlotLabel
                      key={slot}
                      checked={isSlotSelected(date, slot)}
                      onClick={() => toggleSlot(date, slot)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleSlot(date, slot);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSlotSelected(date, slot)}
                    >
                      <button onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSlotSelected(date, slot)}
                          onCheckedChange={() => toggleSlot(date, slot)}
                        />
                      </button>
                      <Typography variant="omega">{slot}</Typography>
                    </SlotLabel>
                  ))}
                </Flex>
              </Flex>
            </DateSection>
          </Grid.Item>
        ))}
      </Grid.Root>

      <Field.Error />
    </Field.Root>
  );
};

export default TimeSlotInput;
