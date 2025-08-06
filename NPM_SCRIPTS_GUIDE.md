# 📝 NPM Scripts Guide for Beginners

This guide explains all the available npm scripts and when to use them. Perfect for developers new to Angular or AWS Amplify!

## 🤔 What are NPM Scripts?

NPM scripts are shortcuts defined in `package.json` that let you run complex commands with simple names. Instead of typing long commands, you just run `npm run script-name`.

## 📋 Available Scripts

### 🚀 **Development Scripts**

#### `npm start` or `npm run start`
```bash
npm start
```
**What it does**: Starts the Angular development server  
**When to use**: When you want to develop and test your app locally  
**Result**: Opens http://localhost:4200 with your app  
**Features**: 
- Hot reload (changes update automatically)
- Source maps for debugging
- Fast compilation

#### `npm run dev`
```bash
npm run dev
```
**What it does**: Same as `npm start` but also opens your browser automatically  
**When to use**: Quick way to start development  
**Perfect for**: Beginners who want everything to "just work"

#### `npm run watch`
```bash
npm run watch
```
**What it does**: Builds your app and watches for changes (no server)  
**When to use**: When you want to see build output without running a server  
**Use case**: Building while working on build configurations

### 🏗️ **Build Scripts**

#### `npm run build`
```bash
npm run build
```
**What it does**: Builds your app for development testing  
**When to use**: Testing the build process  
**Output**: Creates `dist/` folder with your app  
**Note**: Not optimized for production

#### `npm run build:prod`
```bash
npm run build:prod
```
**What it does**: Builds your app for production deployment  
**When to use**: Before deploying to a server  
**Features**:
- Minified code (smaller file sizes)
- Tree shaking (removes unused code)
- Optimized for performance
- Ready for hosting

### 🧪 **Testing Scripts**

#### `npm test` or `npm run test`
```bash
npm test
```
**What it does**: Runs your unit tests  
**When to use**: To check if your code works correctly  
**Features**:
- Runs tests in watch mode
- Updates automatically when you change code

### 🔧 **AWS Amplify Gen 2 Scripts**

#### `npm run sandbox`
```bash
npm run sandbox
```
**What it does**: Starts AWS Amplify Gen 2 cloud sandbox  
**When to use**: 
- Local development with isolated backend
- Testing backend changes without affecting production
- When you need auth, data, and functions

**Features**:
- Creates `amplify_outputs.json` automatically
- Isolated environment per developer
- Real AWS services (not local simulation)
- Takes ~5 minutes to deploy initially

**⚠️ Important**: 
- Requires AWS credentials configured
- Keep running while developing (like a backend localhost)
- Costs small amounts for AWS resources

#### `npm run sandbox:dev`
```bash
npm run sandbox:dev
```
**What it does**: Runs both Angular dev server AND Amplify sandbox together  
**When to use**: Complete fullstack development setup  
**Perfect for**: Beginners who want everything running with one command  
**Note**: Requires `concurrently` package (install with `npm install --save-dev concurrently`)

### 💡 **Helper Scripts**

#### `npm run setup:amplify`
```bash
npm run setup:amplify
```
**What it does**: Shows you the commands needed for first-time Amplify setup  
**When to use**: When you're setting up AWS for the first time  
**Output**: Displays the command sequence you need to run

## 🎯 **Common Workflows**

### **First Time Setup**
```bash
# 1. Install dependencies
npm install

# 2. Configure AWS credentials (one-time setup)
# Follow: https://docs.amplify.aws/angular/start/account-setup/

# 3. Start development
npm run sandbox:dev
# OR run separately:
# Terminal 1: npm run sandbox
# Terminal 2: npm run dev
```

### **Daily Development**
```bash
# Start fullstack development
npm run sandbox:dev

# Or separately:
# Terminal 1: npm run sandbox  (keep running)
# Terminal 2: npm run dev      (keep running)
```

### **Production Deployment**
```bash
# 1. Build for production
npm run build:prod

# 2. Commit and push to git
git add .
git commit -m "your changes"
git push

# 3. Deploy via Amplify Console
# Visit: https://console.aws.amazon.com/amplify/create/repo-branch
```

### **Troubleshooting**
```bash
# Check if amplify_outputs.json exists
ls amplify_outputs.json

# Restart sandbox if needed
npm run sandbox

# Clear and reinstall
npm run clean
```

## ❓ **When Things Go Wrong**

### **"Command not found" errors**
```bash
# Make sure you're in the project directory
cd your-project-folder

# Check if package.json exists
ls package.json

# Install dependencies if missing
npm install
```

### **"Amplify not configured" errors**
```bash
# Check if amplify_outputs.json exists in project root
ls amplify_outputs.json

# If missing, start sandbox
npm run sandbox
```

### **Sandbox not starting**
```bash
# Make sure AWS credentials are configured
# Follow: https://docs.amplify.aws/angular/start/account-setup/

# Check AWS profile
aws sts get-caller-identity

# Restart sandbox
npm run sandbox
```

### **Build errors**
```bash
# Clear everything and start fresh
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Backend out of sync**
```bash
# Restart sandbox to regenerate amplify_outputs.json
npm run sandbox

# Check for amplify_outputs.json
ls amplify_outputs.json
```

## 🎓 **Pro Tips for Beginners**

1. **Always run `npm install` first** when you get a new project
2. **Configure AWS credentials** before starting sandbox
3. **Use `npm run sandbox:dev`** for complete fullstack development
4. **Keep sandbox running** while developing (like localhost for backend)
5. **Check for `amplify_outputs.json`** when things don't work
6. **Don't worry about breaking things** - sandbox is isolated!

## 🔍 **Understanding the Output**

### **Development Server (`npm run dev`)**
```
✔ Browser application bundle generation complete.
➜  Local:   http://localhost:4200/
➜  press h + enter to show help
```
**Meaning**: Your app is ready! Click the link or go to localhost:4200

### **Amplify Sandbox (`npm run sandbox`)**
```
[Amplify] Sandbox environment deployed.
amplify_outputs.json file has been updated.
```
**Meaning**: Backend services are ready and configuration file is updated

### **Build Success (`npm run build`)**
```
✔ Application bundle generation complete.
```
**Meaning**: Your app built successfully and is ready for deployment

## 🎯 **Script Cheat Sheet**

| Want to... | Run this |
|------------|----------|
| Start developing | `npm run sandbox:dev` |
| Start just frontend | `npm run dev` |
| Start just backend | `npm run sandbox` |
| Build for production | `npm run build:prod` |
| Run tests | `npm test` |
| Fix config issues | `npm run sandbox` |
| See all commands | `npm run help` |

---

**Remember**: These scripts make complex tasks simple. Don't be afraid to experiment - you can always start over! 🚀
