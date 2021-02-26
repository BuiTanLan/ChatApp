using ChatApp.Dtos.Request;
using ChatApp.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : Controller
    {
        private readonly DataContext _context;
        public MessageController(DataContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllMessages()
        {
            var messages = await _context.Messages.ToListAsync();
            return Ok(messages);
        }

        [HttpPost]
        public async Task<ActionResult> PostMessage([FromBody] MessageDto messageDto)
        {
            var message = new Message
            {
                Name = messageDto.Name,
                Content = messageDto.Content,
                TimeStamp = DateTime.Now
            };
            await _context.AddAsync(message);
            await _context.SaveChangesAsync();
            return Ok(message);
        }

    }
}
