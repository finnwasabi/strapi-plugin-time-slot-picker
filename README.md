# Strapi Plugin Time Slot Picker

A custom field plugin for Strapi v5 that allows users to select time slots across multiple dates with an intuitive and beautiful UI.

![Time Slot Picker](https://img.shields.io/npm/v/@tunghtml/strapi-plugin-time-slot-picker)
![License](https://img.shields.io/npm/l/@tunghtml/strapi-plugin-time-slot-picker)

## Features

- 🎯 **Visual Time Slot Selection** - Intuitive UI for selecting time slots
- 📅 **Multi-Date Support** - Select slots across multiple dates
- ⏰ **Morning/Afternoon Grouping** - Organized slot layout
- 🎨 **Strapi Design System** - Consistent with Strapi's UI
- 💾 **JSON Storage** - Clean data structure
- ⚙️ **Configurable** - Customize time slots via Content Type Builder

## Installation

```bash
npm install @tunghtml/strapi-plugin-time-slot-picker
```

or

```bash
yarn add @tunghtml/strapi-plugin-time-slot-picker
```

## Configuration

Add the plugin to your `config/plugins.js`:

```javascript
module.exports = {
  // ...
  "time-slot-picker": {
    enabled: true,
    resolve: "./node_modules/@tunghtml/strapi-plugin-time-slot-picker",
  },
};
```

## Usage

### 1. Add Field to Content Type

1. Go to **Content-Type Builder**
2. Select a content type or create a new one
3. Click **Add another field**
4. Select **Custom** tab
5. Choose **Time Slot Picker**
6. Configure the field name
7. Click **Finish** and **Save**

### 2. Configure Time Slots (Optional)

In the **Advanced Settings** of the field, you can configure:

**Morning Slots** (one per line):

```
8:00-9:00
9:00-10:00
10:00-11:00
11:00-12:00
12:00-13:00
```

**Afternoon Slots** (one per line):

```
13:00-14:00
14:00-15:00
15:00-16:00
16:00-17:00
17:00-18:00
```

If not configured, default slots will be used.

### 3. Use in Content Manager

When creating/editing entries:

- Use the date picker to select a date
- Click "Add Date" to add it
- Select time slots by clicking on them
- Use the checkbox in the header to select all slots for a date
- Click the trash icon to remove a date

## Data Structure

The plugin stores data in JSON format:

```json
{
  "days": [
    {
      "date": "2026-06-18",
      "slots": ["8:00-9:00", "9:00-10:00", "11:00-12:00"]
    },
    {
      "date": "2026-06-19",
      "slots": ["13:00-14:00", "14:00-15:00"]
    }
  ]
}
```

## API Usage

```javascript
// GET request
const response = await fetch("/api/your-content-type/1");
const data = await response.json();

// Access time slots
const timeSlots = data.data.attributes.yourFieldName;
console.log(timeSlots.days); // Array of days with selected slots
```

## Requirements

- Strapi v5.0.0 or higher
- Node.js 18.x or higher
- React 18.x or higher

## License

MIT

## Author

Tung Le ([@tunghtml](https://github.com/finnwasabi))

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues, please report them at:
https://github.com/finnwasabi/strapi-plugin-time-slot-picker/issues
