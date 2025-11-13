import PluginIcon from "./admin/src/components/PluginIcon";

export default {
  register(app) {
    app.customFields.register({
      name: "time-slot-picker",
      pluginId: "time-slot-picker",
      type: "json",
      intlLabel: {
        id: "time-slot-picker.label",
        defaultMessage: "Time Slot Picker",
      },
      intlDescription: {
        id: "time-slot-picker.description",
        defaultMessage: "Select time slots for specific dates",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import("./admin/src/components/TimeSlotInput"),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: "time-slot-picker.options.base.settings",
              defaultMessage: "Settings",
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: "time-slot-picker.options.requiredField",
                  defaultMessage: "Required field",
                },
                description: {
                  id: "time-slot-picker.options.requiredField.description",
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: "time-slot-picker.options.advanced.slots",
              defaultMessage: "Time Slots Configuration",
            },
            items: [
              {
                name: "options.morningSlots",
                type: "textarea",
                intlLabel: {
                  id: "time-slot-picker.options.morningSlots",
                  defaultMessage: "Morning Slots (one per line)",
                },
                description: {
                  id: "time-slot-picker.options.morningSlots.description",
                  defaultMessage:
                    "Enter morning time slots, one per line. Example:\n8:00-9:00\n9:00-10:00\n10:00-11:00\n11:00-12:00\n12:00-13:00",
                },
              },
              {
                name: "options.afternoonSlots",
                type: "textarea",
                intlLabel: {
                  id: "time-slot-picker.options.afternoonSlots",
                  defaultMessage: "Afternoon Slots (one per line)",
                },
                description: {
                  id: "time-slot-picker.options.afternoonSlots.description",
                  defaultMessage:
                    "Enter afternoon time slots, one per line. Example:\n13:00-14:00\n14:00-15:00\n15:00-16:00\n16:00-17:00\n17:00-18:00",
                },
              },
            ],
          },
        ],
      },
    });
  },
};
