import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserService } from "~/application/user/user.service";
import type { IUserRepository, IProfileRepository } from "~/application/user/user.port";
import type { IUser, IUserWithProfile, IProfile, UpdateProfileDTO } from "~/domain/user";
import { UserNotFoundError } from "~/domain/user";

/**
 * application/user/user.service.ts 유닛 테스트
 *
 * 테스트 대상: createUserService 팩토리 함수
 * - getUserById: ID로 사용자 조회
 * - getUserByEmail: 이메일로 사용자 조회
 * - getUserWithProfile: 사용자와 프로필 함께 조회
 * - updateProfile: 프로필 업데이트
 */

describe("application/user/user.service", () => {
	// Mock 사용자 데이터
	const mockUser: IUser = {
		id: "user-123",
		name: "Test User",
		email: "test@example.com",
		emailVerified: true,
		image: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	};

	// Mock 프로필 데이터
	const mockProfile: IProfile = {
		id: "profile-123",
		userId: "user-123",
		fullName: "Test Full Name",
		avatarUrl: "https://example.com/avatar.jpg",
		bio: "Test bio",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	};

	// Mock 사용자 + 프로필 데이터
	const mockUserWithProfile: IUserWithProfile = {
		...mockUser,
		profile: mockProfile,
	};

	// Mock UserRepository
	let mockUserRepository: IUserRepository;

	// Mock ProfileRepository
	let mockProfileRepository: IProfileRepository;

	beforeEach(() => {
		vi.clearAllMocks();

		// UserRepository Mock 설정
		mockUserRepository = {
			findById: vi.fn(),
			findByEmail: vi.fn(),
			findWithProfile: vi.fn(),
			update: vi.fn(),
		};

		// ProfileRepository Mock 설정
		mockProfileRepository = {
			findByUserId: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
		};
	});

	describe("createUserService", () => {
		it("UserService 객체를 생성한다", () => {
			// Act
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Assert
			expect(userService).toBeDefined();
			expect(userService.getUserById).toBeDefined();
			expect(userService.getUserByEmail).toBeDefined();
			expect(userService.getUserWithProfile).toBeDefined();
			expect(userService.updateProfile).toBeDefined();
		});
	});

	describe("getUserById", () => {
		it("사용자가 존재하면 사용자 정보를 반환한다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			const result = await userService.getUserById("user-123");

			// Assert
			expect(mockUserRepository.findById).toHaveBeenCalledWith("user-123");
			expect(result).toEqual(mockUser);
		});

		it("사용자가 존재하지 않으면 UserNotFoundError를 던진다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findById).mockResolvedValue(null);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act & Assert
			await expect(userService.getUserById("non-existent")).rejects.toThrow(
				UserNotFoundError,
			);
		});
	});

	describe("getUserByEmail", () => {
		it("사용자가 존재하면 사용자 정보를 반환한다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			const result = await userService.getUserByEmail("test@example.com");

			// Assert
			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
			expect(result).toEqual(mockUser);
		});

		it("사용자가 존재하지 않으면 null을 반환한다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			const result = await userService.getUserByEmail("non-existent@example.com");

			// Assert
			expect(result).toBeNull();
		});
	});

	describe("getUserWithProfile", () => {
		it("사용자와 프로필이 존재하면 함께 반환한다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(mockUserWithProfile);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			const result = await userService.getUserWithProfile("user-123");

			// Assert
			expect(mockUserRepository.findWithProfile).toHaveBeenCalledWith("user-123");
			expect(result).toEqual(mockUserWithProfile);
		});

		it("사용자가 존재하지 않으면 UserNotFoundError를 던진다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(null);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act & Assert
			await expect(userService.getUserWithProfile("non-existent")).rejects.toThrow(
				UserNotFoundError,
			);
		});

		it("프로필이 없는 사용자도 반환한다", async () => {
			// Arrange
			const userWithoutProfile: IUserWithProfile = {
				...mockUser,
				profile: null,
			};
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(userWithoutProfile);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			const result = await userService.getUserWithProfile("user-123");

			// Assert
			expect(result.profile).toBeNull();
		});
	});

	describe("updateProfile", () => {
		const updateData: UpdateProfileDTO = {
			fullName: "Updated Name",
			bio: "Updated bio",
		};

		it("사용자가 존재하지 않으면 UserNotFoundError를 던진다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findById).mockResolvedValue(null);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act & Assert
			await expect(userService.updateProfile("non-existent", updateData)).rejects.toThrow(
				UserNotFoundError,
			);
		});

		it("프로필이 없으면 새로 생성한다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			vi.mocked(mockProfileRepository.findByUserId).mockResolvedValue(null);
			vi.mocked(mockProfileRepository.create).mockResolvedValue(mockProfile);
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(mockUserWithProfile);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			await userService.updateProfile("user-123", updateData);

			// Assert
			expect(mockProfileRepository.create).toHaveBeenCalledWith({
				userId: "user-123",
				...updateData,
			});
			expect(mockProfileRepository.update).not.toHaveBeenCalled();
		});

		it("프로필이 있으면 업데이트한다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			vi.mocked(mockProfileRepository.findByUserId).mockResolvedValue(mockProfile);
			vi.mocked(mockProfileRepository.update).mockResolvedValue({
				...mockProfile,
				...updateData,
			});
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue({
				...mockUserWithProfile,
				profile: { ...mockProfile, ...updateData },
			});
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			await userService.updateProfile("user-123", updateData);

			// Assert
			expect(mockProfileRepository.update).toHaveBeenCalledWith("user-123", updateData);
			expect(mockProfileRepository.create).not.toHaveBeenCalled();
		});

		it("업데이트 후 사용자+프로필을 반환한다", async () => {
			// Arrange
			const updatedProfile: IProfile = {
				...mockProfile,
				fullName: "Updated Name",
				bio: "Updated bio",
			};
			const updatedUserWithProfile: IUserWithProfile = {
				...mockUser,
				profile: updatedProfile,
			};
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			vi.mocked(mockProfileRepository.findByUserId).mockResolvedValue(mockProfile);
			vi.mocked(mockProfileRepository.update).mockResolvedValue(updatedProfile);
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(updatedUserWithProfile);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			const result = await userService.updateProfile("user-123", updateData);

			// Assert
			expect(result).toEqual(updatedUserWithProfile);
		});

		it("업데이트 후 사용자 조회 실패 시 UserNotFoundError를 던진다", async () => {
			// Arrange
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			vi.mocked(mockProfileRepository.findByUserId).mockResolvedValue(mockProfile);
			vi.mocked(mockProfileRepository.update).mockResolvedValue(mockProfile);
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(null);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act & Assert
			await expect(userService.updateProfile("user-123", updateData)).rejects.toThrow(
				UserNotFoundError,
			);
		});

		it("부분 업데이트를 지원한다 (fullName만)", async () => {
			// Arrange
			const partialUpdate: UpdateProfileDTO = { fullName: "Only Name" };
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			vi.mocked(mockProfileRepository.findByUserId).mockResolvedValue(mockProfile);
			vi.mocked(mockProfileRepository.update).mockResolvedValue({
				...mockProfile,
				fullName: "Only Name",
			});
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(mockUserWithProfile);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			await userService.updateProfile("user-123", partialUpdate);

			// Assert
			expect(mockProfileRepository.update).toHaveBeenCalledWith("user-123", partialUpdate);
		});

		it("null 값으로 업데이트를 지원한다", async () => {
			// Arrange
			const nullUpdate: UpdateProfileDTO = { bio: null };
			vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);
			vi.mocked(mockProfileRepository.findByUserId).mockResolvedValue(mockProfile);
			vi.mocked(mockProfileRepository.update).mockResolvedValue({
				...mockProfile,
				bio: null,
			});
			vi.mocked(mockUserRepository.findWithProfile).mockResolvedValue(mockUserWithProfile);
			const userService = createUserService(mockUserRepository, mockProfileRepository);

			// Act
			await userService.updateProfile("user-123", nullUpdate);

			// Assert
			expect(mockProfileRepository.update).toHaveBeenCalledWith("user-123", nullUpdate);
		});
	});
});
