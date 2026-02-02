import { Rocket, Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-[#1F2937] pt-20 pb-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center ">
              <Rocket className="text-white navbar-logo-icon" size={16}  />
            </div>
            <span className="text-xl font-bold text-[#E5E7EB]">
              InflueMatch
            </span>
          </Link>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">
            Revolutionizing the way brands and creators build the future of digital commerce.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-[#E5E7EB]">Platform</h4>
          <ul className="space-y-4 text-sm text-[#9CA3AF]">
            <li className="hover:text-[#3B82F6] transition-colors">
              <Link href="#">Marketplace</Link>
            </li>
            <li className="hover:text-[#3B82F6] transition-colors">
              <Link href="#">Campaigns</Link>
            </li>
            <li className="hover:text-[#3B82F6] transition-colors">
              <Link href="#">Analytics</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-[#E5E7EB]">Company</h4>
          <ul className="space-y-4 text-sm text-[#9CA3AF]">
            <li className="hover:text-[#3B82F6] transition-colors">
              <Link href="#">About Us</Link>
            </li>
            <li className="hover:text-[#3B82F6] transition-colors">
              <Link href="#">Careers</Link>
            </li>
            <li className="hover:text-[#3B82F6] transition-colors">
              <Link href="#">Privacy</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-[#E5E7EB]">Connect</h4>
          <div className="flex gap-4">
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-[#020617] flex items-center justify-center text-[#9CA3AF] hover:bg-[#0B1120] hover:text-[#3B82F6] transition-all border border-[#1F2937]"
            >
              <Twitter size={18} />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-[#020617] flex items-center justify-center text-[#9CA3AF] hover:bg-[#0B1120] hover:text-[#3B82F6] transition-all border border-[#1F2937]"
            >
              <Linkedin size={18} />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-[#020617] flex items-center justify-center text-[#9CA3AF] hover:bg-[#0B1120] hover:text-[#3B82F6] transition-all border border-[#1F2937]"
            >
              <Github size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-8 border-t border-[#1F2937] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#6B7280]">
        <p>© 2024 InflueMatch Inc. All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-[#E5E7EB]">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-[#E5E7EB]">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}