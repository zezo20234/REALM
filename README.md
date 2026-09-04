# Minecraft Economy Web Application (HTML Version)

A single-file HTML implementation of the Minecraft Economy Web Application for Madrid and Barcelona cities.

## 🎯 Features

### Market Shop
- **1,273 Minecraft Items**: Complete database from Minecraft Java 1.20.1
- **Dynamic Pricing**: City-specific pricing with economic multipliers
- **Advanced Filtering**: Search by name and filter by 10 categories
- **Quantity Selection**: Single (1x) or Stack (64x) purchasing options
- **Pagination**: Efficient handling of large item database

### Shopping Cart
- **Real-time Updates**: Cart totals update instantly when city changes
- **Tax System**: Automatic tax calculation (5% Madrid, 10% Barcelona)
- **Receipt Generation**: One-click copy of formatted receipt for Minecraft chat/Discord
- **Smart Cart Management**: Add, remove, and clear cart functionality

### Job Board
- **4 Job Categories**: Architect, Farmer, Transporter, and Mayor
- **City-Specific Jobs**: Different opportunities for Madrid vs Barcelona
- **Pricing Display**: Clear service pricing for each job

## 🚀 Usage

### Quick Start (No Server)
1. Simply open `index.html` in any modern web browser
2. The application will automatically load the items data from `items.json`
3. All functionality works client-side with no server required

### Opening the File
- **Windows**: Double-click `index.html` or right-click → Open with → Chrome/Edge/Firefox
- **Mac**: Double-click `index.html` or right-click → Open With → Safari/Chrome
- **Linux**: Double-click `index.html` or use `xdg-open index.html`

### With Local Server (Optional)
If you prefer to run a local server:

```bash
# Using Node.js (if you have Node installed)
node server.js

# Then open http://localhost:3000 in your browser
```

The simple Node.js server (`server.js`) is included for convenience but is not required.

## 📁 Files Required

- `index.html` - Main application file (contains everything except items data)
- `items.json` - Minecraft items database (must be in the same directory)

## 🎨 Features

### City Toggle
- Switch between Madrid and Barcelona at the top of the Market Shop
- Instantly updates all item prices and cart calculations

### Adding Items to Cart
1. Browse items using search and category filters
2. Select Single (1x) or Stack (64x) quantity
3. Set the desired quantity (1-64)
4. Click "Add to Cart"

### Generating Receipts
1. Add items to your cart
2. Click the cart button (bottom-right corner)
3. Review your cart and totals
4. Click "Copy Order Receipt"
5. Paste the formatted receipt into Minecraft chat or Discord

## 🌐 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 📝 Receipt Format

The generated receipt follows this exact format:

```
==================================
   MINECRAFT STORE RECEIPT
==================================
City Selected: [Madrid or Barcelona]
----------------------------------
ITEMS PURCHASED:
- [Qty]x [Single/Stack] [Item Name] (€[Line Price])
----------------------------------
Subtotal (No Tax):  €[Subtotal Amount]
[City Name] Tax ([5% or 10%]): €[Tax Amount]
==================================
FINAL TOTAL DUE:    €[Total Amount]
==================================
(Tax of €[Tax Amount] paid to [City Name] Mayor Treasury)
```

## 🔧 Configuration

### Tax Rates
- Madrid: 5% (0.05)
- Barcelona: 10% (0.10)

### City Multipliers
- Madrid: Raw materials/food/wood (1.0x), Tech/luxury/armor (1.5x)
- Barcelona: Tech/luxury/armor (1.0x), Raw materials/food/wood (1.5x)

## 🎮 Customization

### Modifying Jobs
Edit the `jobs` object in the `<script>` section of `index.html` to add or modify job listings.

### Modifying Items
To modify items, edit the `items.json` file directly or regenerate it using the original script.

### Styling
All styling is embedded in the `<style>` section of `index.html`. Modify CSS directly in the file.

## 📊 Data

### Items Database
- **Total Items**: 1,273 items from Minecraft 1.20.1
- **Categories**: 10 (raw_materials, food, wood, tech, luxury, armor_tools, blocks, ores, decorative, misc)

### Job Database
- **Total Jobs**: 4 main categories
- **Cities**: Madrid, Barcelona, Highway

## 🛠️ Technical Details

### Single File Architecture
- All HTML, CSS, and JavaScript in one file
- External data loading for items (to keep file size manageable)
- No build process or dependencies required
- Works offline once items.json is loaded

### Performance
- Client-side rendering for fast page loads
- Pagination for efficient item browsing
- Minimal external dependencies

## 🎯 Advantages of HTML Version

- **No Installation**: Just open and use
- **Portable**: Single file + data file
- **No Server Required**: Runs entirely in browser
- **Easy to Deploy**: Upload to any web host or use locally
- **Fast**: No build process or compilation

## 📄 License

This project is created for Minecraft server economy management.

---

**Built with ❤️ for Minecraft Server Economy**