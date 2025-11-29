import { Test, TestingModule } from "@nestjs/testing";
import { ManifestRepository } from "./manifest.repository";
import { HttpService } from "@nestjs/axios";
import { of } from "rxjs";
import { AxiosResponse } from "axios";

describe("ManifestRepository", () => {
  let repository: ManifestRepository;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManifestRepository,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
          },
        },
        {
          provide: require("@nestjs/config").ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === "MANIFEST_API_URL")
                return "https://dummy-url/manifest";
              if (key === "MANIFEST_API_TOKEN") return "8fbf9626f8254089940752570e9481cd";
              return "";
            }),
          },
        },
      ],
    }).compile();

    repository = module.get<ManifestRepository>(ManifestRepository);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("should call getManifest and return data", async () => {
    const mockResponse = { data: { foo: "bar" } } as AxiosResponse;
    (httpService.get as jest.Mock).mockReturnValueOnce(of(mockResponse));
    const result = await repository.getManifest();
    expect(result).toEqual(mockResponse);
    expect(httpService.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ headers: expect.any(Object) }),
    );
  });

  it("should call postManifest and return data", async () => {
    const payload = { environment: "sqa", client: "xs" };
    const mockResponse = { data: { foo: "baz" } } as AxiosResponse;
    (httpService.post as jest.Mock).mockReturnValueOnce(of(mockResponse));
    const result = await repository.postManifest(payload);
    expect(result).toEqual(mockResponse);
    expect(httpService.post).toHaveBeenCalledWith(
      expect.any(String),
      payload,
      expect.objectContaining({ headers: expect.any(Object) }),
    );
  });

  it("should call patchManifest and return data", async () => {
    const payload = { environment: "sqa", client: "xs" };
    const mockResponse = { data: { foo: "patched" } } as AxiosResponse;
    (httpService.patch as jest.Mock).mockReturnValueOnce(of(mockResponse));
    const result = await repository.patchManifest(payload);
    expect(result).toEqual(mockResponse);
    expect(httpService.patch).toHaveBeenCalledWith(
      expect.any(String),
      payload,
      expect.objectContaining({ headers: expect.any(Object) }),
    );
  });
});
