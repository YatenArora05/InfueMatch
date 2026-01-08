import { Rocket, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Rocket className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-gray-900">InflueMatch</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Revolutionizing the way brands and creators build the future of digital commerce.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gray-900">Platform</h4>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="hover:text-purple-600 transition-colors"><Link href="#">Marketplace</Link></li>
            <li className="hover:text-purple-600 transition-colors"><Link href="#">Campaigns</Link></li>
            <li className="hover:text-purple-600 transition-colors"><Link href="#">Analytics</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gray-900">Company</h4>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="hover:text-purple-600 transition-colors"><Link href="#">About Us</Link></li>
            <li className="hover:text-purple-600 transition-colors"><Link href="#">Careers</Link></li>
            <li className="hover:text-purple-600 transition-colors"><Link href="#">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gray-900">Connect</h4>
          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-100 hover:text-purple-600 transition-all">
              <Twitter size={18} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-100 hover:text-purple-600 transition-all">
              <Linkedin size={18} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-purple-100 hover:text-purple-600 transition-all">
              <Github size={18} />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 pt-8 border-t border-gray-100 flex flex-col md:row justify-between items-center gap-4 text-sm text-gray-400">
        <p>© 2024 InflueMatch Inc. All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-gray-600">Terms of Service</Link>
          <Link href="#" className="hover:text-gray-600">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}