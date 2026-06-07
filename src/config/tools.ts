import {
  FileJson,
  Code2,
  Palette,
  Regex,
  Type,
  Database,
  GitCompare,
  Wand2,
  Lock,
  Hash,
  Image,
  Key,
  Package,
  RefreshCw,
  Fingerprint
} from "lucide-react"

export const TOOLS = [
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format and validate JSON instantly.",
    path: "/tools/json-formatter",
    category: "JSON",
    icon: FileJson,
    color: "#06B6D4",
    trending: true
  },
  {
    id: "json-ultimate",
    title: "JSON Formatter Ultimate",
    description: "Advanced JSON toolkit with converters.",
    path: "/tools/json-formatter-pack",
    category: "JSON",
    icon: Database,
    color: "#8B5CF6",
    trending: true
  },
  // {
  //   id: "json-diff",
  //   title: "JSON Diff",
  //   description: "Compare JSON structures visually.",
  //   path: "/tools/json-diff",
  //   category: "JSON",
  //   icon: GitCompare,
  //   color: "#7C3AED"
  // },

  {
    id: "svg-jsx",
    title: "SVG to JSX",
    description: "Convert SVG icons to React components.",
    path: "/tools/svg-to-jsx",
    category: "SVG",
    icon: Code2,
    color: "#10B981",
    trending: true
  },
  // {
  //   id: "svg-optimizer",
  //   title: "SVG Optimizer",
  //   description: "Optimize SVG size and remove metadata.",
  //   path: "/tools/svg-optimizer",
  //   category: "SVG",
  //   icon: Wand2,
  //   color: "#22C55E"
  // },

  {
    id: "color-studio",
    title: "Color Studio",
    description: "Generate palettes and gradients.",
    path: "/tools/color-studio",
    category: "Design",
    icon: Palette,
    color: "#F59E0B"
  },

  {
    id: "regex-tester",
    title: "Regex Tester",
    description: "Test regex patterns instantly.",
    path: "/tools/regex-tester",
    category: "Code",
    icon: Regex,
    color: "#F43F5E"
  },

  {
    id: "text-case",
    title: "Text Case Converter",
    description: "Convert text case formats.",
    path: "/tools/text-case-converter",
    category: "Text",
    icon: Type,
    color: "#6366F1"
  },

  {
    id: "base64",
    title: "Base64 Encoder / Decoder",
    description: "Encode and decode Base64 strings.",
    path: "/tools/base64",
    category: "Encoding",
    icon: Lock,
    color: "#0EA5E9"
  },

  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes.",
    path: "/tools/hash-generator",
    category: "Security",
    icon: Hash,
    color: "#EF4444"
  },

  {
    id: "image-svg",
    title: "Image to SVG",
    description: "Convert images into SVG format.",
    path: "/tools/image-svg",
    category: "Image",
    icon: Image,
    color: "#14B8A6"
  },

  {
    id: "image-svg-ultra",
    title: "Image to SVG Ultra",
    description: "Advanced image to SVG converter.",
    path: "/tools/image-svg-ultra",
    category: "Image",
    icon: Image,
    color: "#06B6D4",
    trending: true
  },

  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and inspect JWT tokens.",
    path: "/tools/jwt-decoder",
    category: "Security",
    icon: Key,
    color: "#F97316"
  },

  {
    id: "lucide-react",
    title: "Lucide React Explorer",
    description: "Browse and copy Lucide icons.",
    path: "/tools/lucide-react",
    category: "Icons",
    icon: Package,
    color: "#111827"
  },

  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure passwords instantly.",
    path: "/tools/password-generator",
    category: "Security",
    icon: Lock,
    color: "#22C55E"
  },

  {
    id: "react-icons",
    title: "React Icons Explorer",
    description: "Search and copy React Icons.",
    path: "/tools/react-icons",
    category: "Icons",
    icon: Package,
    color: "#6366F1"
  },

  {
    id: "react-icons-pack",
    title: "React Icons Pack",
    description: "Browse full React icon libraries.",
    path: "/tools/react-icons-pack",
    category: "Icons",
    icon: Package,
    color: "#8B5CF6"
  },

  {
    id: "text-case-converter",
    title: "Text Case Converter",
    description: "Convert text to multiple case formats.",
    path: "/tools/text-case-converter",
    category: "Text",
    icon: Type,
    color: "#6366F1"
  },

  {
    id: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUID v4 instantly.",
    path: "/tools/uuid-generator",
    category: "Code",
    icon: Fingerprint,
    color: "#10B981"
  },

  // {
  //   id: "universal-converter",
  //   title: "Universal Converter",
  //   description: "Convert between multiple data formats.",
  //   path: "/tools/universal-converter",
  //   category: "Converter",
  //   icon: RefreshCw,
  //   color: "#0EA5E9"
  // }
]
