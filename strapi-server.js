export default {
  register({ strapi }) {
    strapi.customFields.register({
      name: "time-slot-picker",
      plugin: "time-slot-picker",
      type: "json",
    });
  },
};
