using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace Knowit.Umbraco.SvgPicker.Composers;

public class SvgPickerComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddMvcCore().AddApplicationPart(typeof(SvgPickerComposer).Assembly);
    }
}
