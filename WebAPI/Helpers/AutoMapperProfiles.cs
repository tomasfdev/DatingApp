using AutoMapper;
using WebAPI.DTOs;
using WebAPI.Entities;
using WebAPI.Extensions;

namespace WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(destinationMember => destinationMember.PhotoUrl, options => options.MapFrom(source => source.Photos.FirstOrDefault(x => x.IsMain)!.Url)) //include PhotoUrl mapping
                .ForMember(d => d.Age, o => o.MapFrom(s => s.DateOfBirth.CalculateAge()))
                .ReverseMap();
            CreateMap<Photo, PhotoDto>().ReverseMap();
            CreateMap<MemberUpdateDto, AppUser>().ReverseMap();
        }
    }
}
