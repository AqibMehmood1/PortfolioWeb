import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PortfolioApiService, ChatMessageHistoryDto, ChatActionLinkDto, SubmitChatInquiryDto } from '../../services/portfolio-api.service';

interface DisplayChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  formattedContent?: SafeHtml;
  timestamp: Date;
  links?: ChatActionLinkDto[];
  showLeadForm?: boolean;
  leadFormType?: string;
  isStreaming?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesScroll') private messagesScrollContainer!: ElementRef;
  @ViewChild('messageInput') private messageInputElement!: ElementRef;

  isOpen: boolean = false;
  isMinimized: boolean = false;
  showTeaser: boolean = true;
  isLoading: boolean = false;
  userInput: string = '';
  
  // Lead Inquiry form modal within chat
  showInquiryModal: boolean = false;
  inquiryForm: SubmitChatInquiryDto = {
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: 'Enterprise Architecture Consulting',
    message: ''
  };
  isSubmittingInquiry: boolean = false;
  inquirySubmittedSuccess: boolean = false;

  suggestedPills: string[] = [
    '💡 What architecture services do you provide?',
    '🤖 Tell me about your AI Agents & GenAI work',
    '💼 Show me delivered enterprise case studies',
    '⚡ What is your core tech stack?',
    '💰 What are your engagement & pricing models?',
    '📅 How can we schedule a technical consultation?'
  ];

  messages: DisplayChatMessage[] = [];
  private shouldScrollBottom: boolean = false;

  constructor(
    private apiService: PortfolioApiService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initial welcome message
    this.addBotMessage(
      `👋 **Welcome to NEXVOYS Enterprise AI Assistant!**\n\nI am your interactive architectural advisor. I can help you explore our **SaaS multi-tenancy frameworks**, **Autonomous AI Agents**, **legacy .NET modernization**, **case studies**, and **custom engineering engagements**.\n\nHow can I assist your engineering roadmap today?`,
      [
        { label: '🏛️ Architecture Pillars', url: '/services', isExternal: false, icon: 'fas fa-cubes' },
        { label: '💼 Client Case Studies', url: '/projects', isExternal: false, icon: 'fas fa-briefcase' },
        { label: '📅 Book Consultation', url: '/contact', isExternal: false, icon: 'fas fa-calendar-check' }
      ]
    );

    // Auto-dismiss teaser after 10s if not interacted
    setTimeout(() => {
      this.showTeaser = false;
      this.cdr.detectChanges();
    }, 12000);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollBottom) {
      this.scrollToBottom();
      this.shouldScrollBottom = false;
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.showTeaser = false;
    if (this.isOpen) {
      this.shouldScrollBottom = true;
      setTimeout(() => {
        if (this.messageInputElement) {
          this.messageInputElement.nativeElement.focus();
        }
      }, 200);
    }
    this.cdr.detectChanges();
  }

  closeChat(): void {
    this.isOpen = false;
    this.cdr.detectChanges();
  }

  dismissTeaser(event: MouseEvent): void {
    event.stopPropagation();
    this.showTeaser = false;
    this.cdr.detectChanges();
  }

  clearChat(): void {
    this.messages = [];
    this.addBotMessage(
      `🔄 **Conversation reset.**\n\nAsk me anything about NEXVOYS solutions architecture, enterprise case studies, AI agent pipelines, or team availability!`,
      [
        { label: '🏛️ Core Services', url: '/services', isExternal: false, icon: 'fas fa-cubes' },
        { label: '⚡ Tech Radar', url: '/expertise', isExternal: false, icon: 'fas fa-microchip' }
      ]
    );
    this.cdr.detectChanges();
  }

  sendMessage(textToSend?: string): void {
    const query = (textToSend || this.userInput || '').trim();
    if (!query || this.isLoading) return;

    // Add user message
    this.addUserMessage(query);
    this.userInput = '';
    this.isLoading = true;
    this.shouldScrollBottom = true;
    this.cdr.detectChanges();

    // Prepare history for API
    const history: ChatMessageHistoryDto[] = this.messages
      .slice(-8)
      .map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString()
      }));

    this.apiService.sendChatMessage({
      message: query,
      history: history,
      userContext: 'public-visitor'
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const showLead = res.data.showLeadForm || res.data.isLeadCapturePrompt || false;
          this.addBotMessage(
            res.data.reply,
            res.data.links,
            showLead,
            res.data.leadFormType
          );

          const actions = res.data.suggestedActions || res.data.suggestedQuestions;
          if (actions && actions.length > 0) {
            this.suggestedPills = actions;
          }
        } else {
          this.addBotMessage(
            `I encountered an issue processing your request. Please explore our [Services](/services) or reach out directly at [Contact Us](/contact).`,
            [{ label: 'Contact Us', url: '/contact', isExternal: false, icon: 'fas fa-envelope' }]
          );
        }
        this.shouldScrollBottom = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.addBotMessage(
          `⚠️ Unable to reach our AI advisory service at this moment. You can always email our team directly at [solutions@nexvoys.com](mailto:solutions@nexvoys.com) or schedule a call via our [Contact Page](/contact).`,
          [{ label: 'Schedule Consultation', url: '/contact', isExternal: false, icon: 'fas fa-calendar-alt' }]
        );
        this.shouldScrollBottom = true;
        this.cdr.detectChanges();
      }
    });
  }

  selectPrompt(pill: string): void {
    this.sendMessage(pill);
  }

  openInquiryModal(defaultInterest?: string): void {
    if (defaultInterest) {
      this.inquiryForm.interest = defaultInterest;
    }
    this.showInquiryModal = true;
    this.inquirySubmittedSuccess = false;
    this.cdr.detectChanges();
  }

  closeInquiryModal(): void {
    this.showInquiryModal = false;
    this.cdr.detectChanges();
  }

  submitInquiry(): void {
    if (!this.inquiryForm.name || !this.inquiryForm.email || !this.inquiryForm.message) {
      alert('Please provide your name, email, and a brief description of your project.');
      return;
    }

    this.isSubmittingInquiry = true;
    
    // Construct brief transcript summary
    const recentQueries = this.messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .slice(-3)
      .join(' | ');

    this.inquiryForm.chatTranscriptSummary = recentQueries || 'Direct Chatbot Lead Form Submission';

    this.apiService.submitChatInquiry(this.inquiryForm).subscribe({
      next: (res) => {
        this.isSubmittingInquiry = false;
        this.inquirySubmittedSuccess = true;
        this.showInquiryModal = false;
        
        this.addBotMessage(
          `🎉 **Inquiry Received!**\n\nThank you **${this.inquiryForm.name}**! Your technical inquiry regarding *"${this.inquiryForm.interest}"* has been routed to our Principal Solutions Architect.\n\nWe will review your requirements and follow up via **${this.inquiryForm.email}** within 24 business hours.`,
          [{ label: 'Explore More Case Studies', url: '/projects', isExternal: false, icon: 'fas fa-layer-group' }]
        );

        // Reset form
        this.inquiryForm = {
          name: '',
          email: '',
          phone: '',
          company: '',
          interest: 'Enterprise Architecture Consulting',
          message: ''
        };
        this.shouldScrollBottom = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmittingInquiry = false;
        alert('Could not submit inquiry at this moment. Please try again or visit our Contact page.');
        this.cdr.detectChanges();
      }
    });
  }

  navigateAction(link: ChatActionLinkDto, event: MouseEvent): void {
    event.preventDefault();
    if (link.url.startsWith('#inquiry') || link.url === '#lead') {
      this.openInquiryModal(link.label);
      return;
    }

    if (link.isExternal || link.url.startsWith('http') || link.url.startsWith('mailto:') || link.url.startsWith('tel:')) {
      window.open(link.url, '_blank');
    } else {
      this.router.navigateByUrl(link.url);
    }
  }

  private addUserMessage(content: string): void {
    this.messages.push({
      id: this.generateId(),
      role: 'user',
      content: content,
      timestamp: new Date()
    });
  }

  private addBotMessage(
    content: string,
    links?: ChatActionLinkDto[],
    showLeadForm?: boolean,
    leadFormType?: string
  ): void {
    this.messages.push({
      id: this.generateId(),
      role: 'assistant',
      content: content,
      formattedContent: this.parseMarkdown(content),
      timestamp: new Date(),
      links: links || [],
      showLeadForm: showLeadForm || false,
      leadFormType: leadFormType
    });
  }

  private parseMarkdown(text: string): SafeHtml {
    if (!text) return '';

    let html = text
      // Escape raw HTML tags
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Markdown Headings: ###, ##, #
      .replace(/^###\s+(.*)$/gm, '<h6 class="chat-h3">$1</h6>')
      .replace(/^##\s+(.*)$/gm, '<h5 class="chat-h2">$1</h5>')
      .replace(/^#\s+(.*)$/gm, '<h4 class="chat-h1">$1</h4>')
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code `code`
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Markdown links [text](url)
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="chat-inline-link" target="_blank" rel="noopener noreferrer">$1</a>')
      // Bullet points - item or * item
      .replace(/^\s*[-*]\s+(.*)$/gm, '<li class="chat-bullet-item">$1</li>')
      // Numbered lists 1. item
      .replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="chat-num-item">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '<div class="chat-para-break"></div>')
      .replace(/\n/g, '<br/>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li class="chat-bullet-item">.*?<\/li>)+/g, '<ul class="chat-list">$1</ul>');
    html = html.replace(/(<li class="chat-num-item">.*?<\/li>)+/g, '<ol class="chat-list-num">$1</ol>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesScrollContainer) {
        const el = this.messagesScrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {
      // Ignore scroll calculation errors
    }
  }

  private generateId(): string {
    return 'msg_' + Math.random().toString(36).substring(2, 9);
  }
}
