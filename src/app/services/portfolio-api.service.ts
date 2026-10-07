import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ProjectItem,
  ServiceItem,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  AccordionService,
  IndustryItem,
  TestimonialItem
} from '../models/portfolio.model';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
}

export interface WebsiteSettingsData {
  settings: Record<string, string>;
  companyName: string;
  tagline: string;
  role: string;
  email: string;
  phone: string;
  displayPhone: string;
  location: string;
  linkedinUrl: string;
  cvPath: string;
  logoDark: string;
  logoLight: string;
  favicon: string;
  footerBio: string;
  copyrightText: string;
  tickerTexts: string[];
}

export interface HomePageData {
  headline: string;
  subtitle: string;
  typedStrings: string[];
  stats: { value: string; label: string; icon?: string }[];
  additionalData?: any;
}

export interface AboutPageData {
  headline: string;
  subtitle: string;
  visionHeadline: string;
  visionLead: string;
  visionDescription: string;
  focusAreas: string[];
  executionSteps: { step: string; title: string; description: string }[];
  valueCards: { title: string; description: string }[];
  threeStepProcess: { step: string; title: string; description: string }[];
}

export interface TechnologyCategoryDto {
  id: number;
  key: string;
  label: string;
  displayOrder: number;
  technologies: {
    id: number;
    categoryKey: string;
    name: string;
    icon: string;
    color: string;
    displayOrder: number;
  }[];
}

export interface SeoMetadataDto {
  id: number;
  pageRoute: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<ApiResponse<WebsiteSettingsData>> {
    return this.http.get<ApiResponse<WebsiteSettingsData>>(`${this.baseUrl}/settings`);
  }

  getHomeContent(): Observable<ApiResponse<HomePageData>> {
    return this.http.get<ApiResponse<HomePageData>>(`${this.baseUrl}/home`);
  }

  getAboutContent(): Observable<ApiResponse<AboutPageData>> {
    return this.http.get<ApiResponse<AboutPageData>>(`${this.baseUrl}/about`);
  }

  getServices(): Observable<ApiResponse<ServiceItem[]>> {
    return this.http.get<ApiResponse<ServiceItem[]>>(`${this.baseUrl}/services`);
  }

  getAccordionServices(): Observable<ApiResponse<AccordionService[]>> {
    return this.http.get<ApiResponse<AccordionService[]>>(`${this.baseUrl}/services/accordion`);
  }

  getProjects(filter?: string): Observable<ApiResponse<ProjectItem[]>> {
    const url = filter && filter !== 'all' 
      ? `${this.baseUrl}/projects?filter=${filter}` 
      : `${this.baseUrl}/projects`;
    return this.http.get<ApiResponse<ProjectItem[]>>(url);
  }

  getFeaturedProjects(): Observable<ApiResponse<ProjectItem[]>> {
    return this.http.get<ApiResponse<ProjectItem[]>>(`${this.baseUrl}/projects/featured`);
  }

  getProjectBySlug(slug: string): Observable<ApiResponse<ProjectItem>> {
    return this.http.get<ApiResponse<ProjectItem>>(`${this.baseUrl}/projects/${slug}`);
  }

  getTechnologiesGrouped(): Observable<ApiResponse<Record<string, any[]>>> {
    return this.http.get<ApiResponse<Record<string, any[]>>>(`${this.baseUrl}/technologies`);
  }

  getTechnologyCategories(): Observable<ApiResponse<TechnologyCategoryDto[]>> {
    return this.http.get<ApiResponse<TechnologyCategoryDto[]>>(`${this.baseUrl}/technologies/categories`);
  }

  getExperiences(): Observable<ApiResponse<ExperienceItem[]>> {
    return this.http.get<ApiResponse<ExperienceItem[]>>(`${this.baseUrl}/experience`);
  }

  getEducations(): Observable<ApiResponse<EducationItem[]>> {
    return this.http.get<ApiResponse<EducationItem[]>>(`${this.baseUrl}/experience/education`);
  }

  getCertifications(): Observable<ApiResponse<CertificationItem[]>> {
    return this.http.get<ApiResponse<CertificationItem[]>>(`${this.baseUrl}/experience/certifications`);
  }

  getTestimonials(): Observable<ApiResponse<TestimonialItem[]>> {
    return this.http.get<ApiResponse<TestimonialItem[]>>(`${this.baseUrl}/testimonials`);
  }

  getIndustries(): Observable<ApiResponse<IndustryItem[]>> {
    return this.http.get<ApiResponse<IndustryItem[]>>(`${this.baseUrl}/testimonials/industries`);
  }

  submitContactInquiry(inquiry: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject?: string;
    techStack?: string;
    message: string;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/contact`, inquiry);
  }

  getSeoByRoute(route: string): Observable<ApiResponse<SeoMetadataDto>> {
    return this.http.get<ApiResponse<SeoMetadataDto>>(`${this.baseUrl}/seo/by-route?route=${encodeURIComponent(route)}`);
  }
}
