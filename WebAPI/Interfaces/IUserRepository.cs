using WebAPI.DTOs;
using WebAPI.Entities;

namespace WebAPI.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser?> GetUserByIdAsync(int id);
        Task<AppUser?> GetUserByUsernameAsync(string username);
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<MemberDto>> GetMembersAsync();
        Task<MemberDto?> GetMemberByUsernameAsync(string username);
    }
}