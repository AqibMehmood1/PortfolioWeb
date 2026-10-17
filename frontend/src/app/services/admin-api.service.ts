import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AdminUserDto {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface LoginResponseData {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: AdminUserDto;
}

export interface DashboardStatsDto {
  totalProjects: number;
  publishedProjects: number;
  totalServices: number;
  totalTechnologies: number;
  totalTestimonials: number;
  totalInquiries: number;
  newInquiries: number;
  totalMediaFiles: number;
  recentInquiries: any[];
  recentProjects: any[];
  recentActivities?: any[];
  recentActivity?: any[];
}
export type DashboardStatsData = DashboardStatsDto;

export interface WebsiteSettingDto {
  id?: number;
  key: string;
  value: string;
  group?: string;
  description?: string;
}

export interface StatItemDto {
  value: string;
  label: string;
  icon?: string;
}

export interface HomePageContentDto {
  headline: string;
  subtitle: string;
  typedStrings: string[];
  stats: StatItemDto[];
  additionalData?: any;
}

export interface StepItemDto {
  step: string;
  title: string;
  description: string;
}

export interface ValueCardDto {
  title: string;
  description: string;
}

export interface AboutContentDto {
  headline: string;
  subtitle: string;
  visionHeadline: string;
  visionLead: string;
  visionDescription: string;
  focusAreas: string[];
  executionSteps: StepItemDto[];
  valueCards: ValueCardDto[];
  threeStepProcess: StepItemDto[];
}

export interface ServiceDto {
  id?: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  icon: string;
  featuresJson: string;
  technologiesJson: string;
  deliverablesJson: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface AccordionItemDto {
  id?: number;
  num: string;
  title: string;
  category: string;
  description: string;
  detailsJson: string;
  tagsJson: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ProjectDto {
  id?: number;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  description: string;
  longDescription: string;
  client: string;
  duration: string;
  role: string;
  thumbnailUrl: string;
  image: string;
  gif: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  isPublished: boolean;
  displayOrder: number;
  technologiesJson: string;
  challengesJson: string;
  solutionsJson: string;
  impactMetricsJson: string;
}

export interface TechnologyCategoryDto {
  id?: number;
  name: string;
  slug: string;
  subtitle: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

export interface TechnologyDto {
  id?: number;
  name: string;
  slug: string;
  icon: string;
  level: string;
  proficiencyPercentage: number;
  description: string;
  categoryId?: number;
  categoryName?: string;
  displayOrder: number;
  isActive: boolean;
  tagsJson: string;
}

export interface ExperienceDto {
  id?: number;
  role: string;
  company: string;
  location: string;
  type: string;
  period: string;
  description: string;
  responsibilitiesJson: string;
  technologiesJson: string;
  isCurrent: boolean;
  displayOrder: number;
  isActive: boolean;
}

export interface EducationDto {
  id?: number;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  period: string;
  gradeOrHonor: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CertificationDto {
  id?: number;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl: string;
  badgeIcon: string;
  displayOrder: number;
  isActive: boolean;
}

export interface TestimonialDto {
  id?: number;
  author: string;
  role: string;
  company: string;
  quote: string;
  projectDelivered: string;
  rating: number;
  avatarUrl: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface IndustryDto {
  id?: number;
  name: string;
  description: string;
  icon: string;
  systemsCount: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ContactInquiryDto {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  techStack?: string;
  message: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

export interface MediaFileDto {
  id?: number;
  fileName: string;
  originalFileName: string;
  filePath?: string;
  contentType: string;
  fileSizeBytes: number;
  url: string;
  altText?: string;
  category?: string;
  createdAt: string;
}

export interface SeoMetadataDto {
  id?: number;
  pageRoute: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  robots: string;
}

export interface AuditLogDto {
  id?: number;
  userId?: number;
  username: string;
  action: string;
  entityName: string;
  entityId?: string;
  changes?: string;
  ipAddress?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private baseUrl = `${environment.apiUrl}/admin`;

  private currentUserSubject = new BehaviorSubject<AdminUserDto | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredUser(): AdminUserDto | null {
    try {
      const stored = localStorage.getItem('nexvoys_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('nexvoys_admin_token');
    return !!token;
  }

  get token(): string | null {
    return localStorage.getItem('nexvoys_admin_token');
  }

  login(credentials: { username: string; password: string }): Observable<ApiResponse<LoginResponseData>> {
    return this.http.post<ApiResponse<LoginResponseData>>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((res: ApiResponse<LoginResponseData>) => {
        if (res.success && res.data) {
          localStorage.setItem('nexvoys_admin_token', res.data.token);
          localStorage.setItem('nexvoys_admin_refresh_token', res.data.refreshToken);
          localStorage.setItem('nexvoys_admin_user', JSON.stringify(res.data.user));
          this.currentUserSubject.next(res.data.user);
        }
      })
    );
  }

  logout(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }

  clearSession(): void {
    localStorage.removeItem('nexvoys_admin_token');
    localStorage.removeItem('nexvoys_admin_refresh_token');
    localStorage.removeItem('nexvoys_admin_user');
    this.currentUserSubject.next(null);
  }

  // --- Dashboard ---
  getDashboardStats(): Observable<ApiResponse<DashboardStatsDto>> {
    return this.http.get<ApiResponse<DashboardStatsDto>>(`${this.baseUrl}/dashboard`).pipe(
      map(res => {
        if (res.data) {
          const acts = (res.data as any).recentActivities || (res.data as any).recentActivity || [];
          res.data.recentActivities = acts;
          res.data.recentActivity = acts;
          res.data.recentInquiries = res.data.recentInquiries || [];
          res.data.recentProjects = res.data.recentProjects || [];
        }
        return res;
      })
    );
  }
  getDashboard(): Observable<ApiResponse<DashboardStatsDto>> {
    return this.getDashboardStats();
  }

  // --- Website Settings ---
  getSettings(): Observable<ApiResponse<WebsiteSettingDto[]>> {
    return this.http.get<ApiResponse<WebsiteSettingDto[]>>(`${this.baseUrl}/settings`);
  }
  getAllSettings(): Observable<ApiResponse<WebsiteSettingDto[]>> {
    return this.getSettings();
  }
  updateSetting(key: string, data: { key: string; value: string; group?: string; description?: string }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/settings/${key}`, data);
  }
  updateSettings(data: WebsiteSettingDto[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/settings/batch`, data);
  }

  // --- Home Content ---
  getHomeContent(): Observable<ApiResponse<HomePageContentDto>> {
    return this.http.get<ApiResponse<HomePageContentDto>>(`${this.baseUrl}/home`);
  }
  updateHomeContent(data: HomePageContentDto): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/home`, data);
  }

  // --- About Content ---
  getAboutContent(): Observable<ApiResponse<AboutContentDto>> {
    return this.http.get<ApiResponse<AboutContentDto>>(`${this.baseUrl}/about`);
  }
  updateAboutContent(data: AboutContentDto): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/about`, data);
  }

  // --- Services ---
  getServices(page = 1, pageSize = 100): Observable<ApiResponse<ServiceDto[]>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/services?page=${page}&pageSize=${pageSize}`).pipe(
      map(res => {
        if (res.data && res.data.items) {
          return { ...res, data: res.data.items as ServiceDto[] };
        }
        return res as ApiResponse<ServiceDto[]>;
      })
    );
  }
  createService(data: ServiceDto): Observable<ApiResponse<ServiceDto>> {
    return this.http.post<ApiResponse<ServiceDto>>(`${this.baseUrl}/services`, data);
  }
  updateService(id: number, data: ServiceDto): Observable<ApiResponse<ServiceDto>> {
    return this.http.put<ApiResponse<ServiceDto>>(`${this.baseUrl}/services/${id}`, data);
  }
  deleteService(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/services/${id}`);
  }

  // --- Accordion Services ---
  getAccordionItems(): Observable<ApiResponse<AccordionItemDto[]>> {
    return this.http.get<ApiResponse<AccordionItemDto[]>>(`${this.baseUrl}/services/accordion`);
  }
  createAccordionItem(data: AccordionItemDto): Observable<ApiResponse<AccordionItemDto>> {
    return this.http.post<ApiResponse<AccordionItemDto>>(`${this.baseUrl}/services/accordion`, data);
  }
  updateAccordionItem(id: number, data: AccordionItemDto): Observable<ApiResponse<AccordionItemDto>> {
    return this.http.put<ApiResponse<AccordionItemDto>>(`${this.baseUrl}/services/accordion/${id}`, data);
  }
  deleteAccordionItem(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/services/accordion/${id}`);
  }

  // --- Projects ---
  getProjects(page = 1, pageSize = 100): Observable<ApiResponse<ProjectDto[]>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/projects?page=${page}&pageSize=${pageSize}`).pipe(
      map(res => {
        if (res.data && res.data.items) {
          return { ...res, data: res.data.items as ProjectDto[] };
        }
        return res as ApiResponse<ProjectDto[]>;
      })
    );
  }
  createProject(data: ProjectDto): Observable<ApiResponse<ProjectDto>> {
    return this.http.post<ApiResponse<ProjectDto>>(`${this.baseUrl}/projects`, data);
  }
  updateProject(id: number, data: ProjectDto): Observable<ApiResponse<ProjectDto>> {
    return this.http.put<ApiResponse<ProjectDto>>(`${this.baseUrl}/projects/${id}`, data);
  }
  deleteProject(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/projects/${id}`);
  }

  // --- Tech Categories & Technologies ---
  getTechCategories(): Observable<ApiResponse<TechnologyCategoryDto[]>> {
    return this.http.get<ApiResponse<TechnologyCategoryDto[]>>(`${this.baseUrl}/technologies/categories`);
  }
  createTechCategory(data: TechnologyCategoryDto): Observable<ApiResponse<TechnologyCategoryDto>> {
    return this.http.post<ApiResponse<TechnologyCategoryDto>>(`${this.baseUrl}/technologies/categories`, data);
  }
  updateTechCategory(id: number, data: TechnologyCategoryDto): Observable<ApiResponse<TechnologyCategoryDto>> {
    return this.http.put<ApiResponse<TechnologyCategoryDto>>(`${this.baseUrl}/technologies/categories/${id}`, data);
  }
  deleteTechCategory(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/technologies/categories/${id}`);
  }

  getTechnologies(page = 1, pageSize = 200): Observable<ApiResponse<TechnologyDto[]>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/technologies?page=${page}&pageSize=${pageSize}`).pipe(
      map(res => {
        if (res.data && res.data.items) {
          return { ...res, data: res.data.items as TechnologyDto[] };
        }
        return res as ApiResponse<TechnologyDto[]>;
      })
    );
  }
  createTechnology(data: TechnologyDto): Observable<ApiResponse<TechnologyDto>> {
    return this.http.post<ApiResponse<TechnologyDto>>(`${this.baseUrl}/technologies`, data);
  }
  updateTechnology(id: number, data: TechnologyDto): Observable<ApiResponse<TechnologyDto>> {
    return this.http.put<ApiResponse<TechnologyDto>>(`${this.baseUrl}/technologies/${id}`, data);
  }
  deleteTechnology(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/technologies/${id}`);
  }

  // --- Experience & Education & Certs ---
  getExperiences(): Observable<ApiResponse<ExperienceDto[]>> {
    return this.http.get<ApiResponse<ExperienceDto[]>>(`${this.baseUrl}/experience`);
  }
  createExperience(data: ExperienceDto): Observable<ApiResponse<ExperienceDto>> {
    return this.http.post<ApiResponse<ExperienceDto>>(`${this.baseUrl}/experience`, data);
  }
  updateExperience(id: number, data: ExperienceDto): Observable<ApiResponse<ExperienceDto>> {
    return this.http.put<ApiResponse<ExperienceDto>>(`${this.baseUrl}/experience/${id}`, data);
  }
  deleteExperience(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/experience/${id}`);
  }

  getEducations(): Observable<ApiResponse<EducationDto[]>> {
    return this.http.get<ApiResponse<EducationDto[]>>(`${this.baseUrl}/experience/education`);
  }
  createEducation(data: EducationDto): Observable<ApiResponse<EducationDto>> {
    return this.http.post<ApiResponse<EducationDto>>(`${this.baseUrl}/experience/education`, data);
  }
  updateEducation(id: number, data: EducationDto): Observable<ApiResponse<EducationDto>> {
    return this.http.put<ApiResponse<EducationDto>>(`${this.baseUrl}/experience/education/${id}`, data);
  }
  deleteEducation(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/experience/education/${id}`);
  }

  getCertifications(): Observable<ApiResponse<CertificationDto[]>> {
    return this.http.get<ApiResponse<CertificationDto[]>>(`${this.baseUrl}/experience/certifications`);
  }
  createCertification(data: CertificationDto): Observable<ApiResponse<CertificationDto>> {
    return this.http.post<ApiResponse<CertificationDto>>(`${this.baseUrl}/experience/certifications`, data);
  }
  updateCertification(id: number, data: CertificationDto): Observable<ApiResponse<CertificationDto>> {
    return this.http.put<ApiResponse<CertificationDto>>(`${this.baseUrl}/experience/certifications/${id}`, data);
  }
  deleteCertification(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/experience/certifications/${id}`);
  }

  // --- Testimonials & Industries ---
  getTestimonials(): Observable<ApiResponse<TestimonialDto[]>> {
    return this.http.get<ApiResponse<TestimonialDto[]>>(`${this.baseUrl}/testimonials`);
  }
  createTestimonial(data: TestimonialDto): Observable<ApiResponse<TestimonialDto>> {
    return this.http.post<ApiResponse<TestimonialDto>>(`${this.baseUrl}/testimonials`, data);
  }
  updateTestimonial(id: number, data: TestimonialDto): Observable<ApiResponse<TestimonialDto>> {
    return this.http.put<ApiResponse<TestimonialDto>>(`${this.baseUrl}/testimonials/${id}`, data);
  }
  deleteTestimonial(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/testimonials/${id}`);
  }

  getIndustries(): Observable<ApiResponse<IndustryDto[]>> {
    return this.http.get<ApiResponse<IndustryDto[]>>(`${this.baseUrl}/testimonials/industries`);
  }
  createIndustry(data: IndustryDto): Observable<ApiResponse<IndustryDto>> {
    return this.http.post<ApiResponse<IndustryDto>>(`${this.baseUrl}/testimonials/industries`, data);
  }
  updateIndustry(id: number, data: IndustryDto): Observable<ApiResponse<IndustryDto>> {
    return this.http.put<ApiResponse<IndustryDto>>(`${this.baseUrl}/testimonials/industries/${id}`, data);
  }
  deleteIndustry(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/testimonials/industries/${id}`);
  }

  // --- Inquiries ---
  getInquiries(page = 1, pageSize = 100, status = ''): Observable<ApiResponse<ContactInquiryDto[]>> {
    let url = `${this.baseUrl}/inquiries?page=${page}&pageSize=${pageSize}`;
    if (status && status !== 'ALL') url += `&status=${status}`;
    return this.http.get<ApiResponse<any>>(url).pipe(
      map(res => {
        if (res.data && res.data.items) {
          return { ...res, data: res.data.items as ContactInquiryDto[] };
        }
        return res as ApiResponse<ContactInquiryDto[]>;
      })
    );
  }
  updateInquiryStatus(id: number, status: string, notes?: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/inquiries/${id}/status`, { status, notes });
  }
  deleteInquiry(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/inquiries/${id}`);
  }

  // --- Media ---
  getMediaFiles(page = 1, pageSize = 100, search = ''): Observable<ApiResponse<MediaFileDto[]>> {
    let url = `${this.baseUrl}/media?page=${page}&pageSize=${pageSize}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return this.http.get<ApiResponse<any>>(url).pipe(
      map(res => {
        if (res.data && res.data.items) {
          return { ...res, data: res.data.items as MediaFileDto[] };
        }
        return res as ApiResponse<MediaFileDto[]>;
      })
    );
  }
  uploadMedia(fileOrFormData: File | FormData): Observable<ApiResponse<MediaFileDto>> {
    let form: FormData;
    if (fileOrFormData instanceof File) {
      form = new FormData();
      form.append('file', fileOrFormData);
    } else {
      form = fileOrFormData;
    }
    return this.http.post<ApiResponse<MediaFileDto>>(`${this.baseUrl}/media/upload`, form);
  }
  deleteMedia(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/media/${id}`);
  }

  // --- Users ---
  getUsers(): Observable<ApiResponse<AdminUserDto[]>> {
    return this.http.get<ApiResponse<AdminUserDto[]>>(`${this.baseUrl}/users`);
  }
  getAdminUsers(): Observable<ApiResponse<AdminUserDto[]>> {
    return this.getUsers();
  }
  createUser(data: any): Observable<ApiResponse<AdminUserDto>> {
    return this.http.post<ApiResponse<AdminUserDto>>(`${this.baseUrl}/users`, data);
  }
  createAdminUser(data: any): Observable<ApiResponse<AdminUserDto>> {
    return this.createUser(data);
  }
  updateUser(id: number, data: any): Observable<ApiResponse<AdminUserDto>> {
    return this.http.put<ApiResponse<AdminUserDto>>(`${this.baseUrl}/users/${id}`, data);
  }
  updateAdminUser(id: number, data: any): Observable<ApiResponse<AdminUserDto>> {
    return this.updateUser(id, data);
  }
  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/users/${id}`);
  }
  deleteAdminUser(id: number): Observable<ApiResponse<any>> {
    return this.deleteUser(id);
  }

  // --- Audit Logs ---
  getAuditLogs(page = 1, pageSize = 30, search = ''): Observable<ApiResponse<PagedResult<AuditLogDto>>> {
    let url = `${this.baseUrl}/audit-logs?page=${page}&pageSize=${pageSize}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return this.http.get<ApiResponse<PagedResult<AuditLogDto>>>(url);
  }

  // --- SEO ---
  getSeoList(): Observable<ApiResponse<SeoMetadataDto[]>> {
    return this.http.get<ApiResponse<SeoMetadataDto[]>>(`${this.baseUrl}/seo`);
  }
  getAllSeo(): Observable<ApiResponse<SeoMetadataDto[]>> {
    return this.getSeoList();
  }
  createSeo(data: SeoMetadataDto): Observable<ApiResponse<SeoMetadataDto>> {
    return this.http.post<ApiResponse<SeoMetadataDto>>(`${this.baseUrl}/seo`, data);
  }
  updateSeo(id: number, data: SeoMetadataDto): Observable<ApiResponse<SeoMetadataDto>> {
    return this.http.put<ApiResponse<SeoMetadataDto>>(`${this.baseUrl}/seo/${id}`, data);
  }
  deleteSeo(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/seo/${id}`);
  }

  // --- Pages & Sections Management ---
  getAllPages(): Observable<ApiResponse<SitePageDto[]>> {
    return this.http.get<ApiResponse<SitePageDto[]>>(`${this.baseUrl}/pages`);
  }
  getPageById(id: number): Observable<ApiResponse<SitePageDto>> {
    return this.http.get<ApiResponse<SitePageDto>>(`${this.baseUrl}/pages/${id}`);
  }
  createPage(dto: CreateSitePageDto): Observable<ApiResponse<SitePageDto>> {
    return this.http.post<ApiResponse<SitePageDto>>(`${this.baseUrl}/pages`, dto);
  }
  updatePage(id: number, dto: UpdateSitePageDto): Observable<ApiResponse<SitePageDto>> {
    return this.http.put<ApiResponse<SitePageDto>>(`${this.baseUrl}/pages/${id}`, dto);
  }
  deletePage(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/pages/${id}`);
  }
  togglePageVisibility(id: number): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/pages/${id}/toggle-visibility`, {});
  }
  togglePageNav(id: number): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/pages/${id}/toggle-nav`, {});
  }
  createSection(pageId: number, dto: CreateSiteSectionDto): Observable<ApiResponse<SiteSectionDto>> {
    return this.http.post<ApiResponse<SiteSectionDto>>(`${this.baseUrl}/pages/${pageId}/sections`, dto);
  }
  updateSection(sectionId: number, dto: UpdateSiteSectionDto): Observable<ApiResponse<SiteSectionDto>> {
    return this.http.put<ApiResponse<SiteSectionDto>>(`${this.baseUrl}/pages/sections/${sectionId}`, dto);
  }
  deleteSection(sectionId: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/pages/sections/${sectionId}`);
  }
  toggleSectionVisibility(sectionId: number): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/pages/sections/${sectionId}/toggle-visibility`, {});
  }
  reorderSections(items: ReorderItemDto[]): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/pages/sections/reorder`, items);
  }
}

export interface SiteSectionDto {
  id: number;
  pageId: number;
  pageSlug: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  description?: string;
  sectionType: string;
  isVisible: boolean;
  isSystem: boolean;
  displayOrder: number;
  contentJson?: string;
  customHtml?: string;
}

export interface SitePageDto {
  id: number;
  slug: string;
  title: string;
  navTitle: string;
  isVisible: boolean;
  showInNav: boolean;
  showInFooter: boolean;
  isSystem: boolean;
  displayOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  sectionCount: number;
  sections: SiteSectionDto[];
}

export interface CreateSitePageDto {
  slug: string;
  title: string;
  navTitle?: string;
  isVisible: boolean;
  showInNav: boolean;
  showInFooter: boolean;
  displayOrder: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateSitePageDto {
  slug: string;
  title: string;
  navTitle?: string;
  isVisible: boolean;
  showInNav: boolean;
  showInFooter: boolean;
  displayOrder: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CreateSiteSectionDto {
  pageId: number;
  sectionKey: string;
  title: string;
  subtitle?: string;
  description?: string;
  sectionType: string;
  isVisible: boolean;
  displayOrder: number;
  contentJson?: string;
  customHtml?: string;
}

export interface UpdateSiteSectionDto {
  sectionKey: string;
  title: string;
  subtitle?: string;
  description?: string;
  sectionType: string;
  isVisible: boolean;
  displayOrder: number;
  contentJson?: string;
  customHtml?: string;
}

export interface ReorderItemDto {
  id: number;
  displayOrder: number;
}
