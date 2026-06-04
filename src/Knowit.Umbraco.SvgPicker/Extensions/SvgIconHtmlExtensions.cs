using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Knowit.Umbraco.SvgPicker.Extensions;

public static class SvgIconHtmlExtensions
{
    public static IHtmlContent SvgIcon(
        this IHtmlHelper html,
        string? symbolId,
        string? cssClass = null,
        string spritePath = "/assets/svg/sprite.svg")
    {
        if (string.IsNullOrWhiteSpace(symbolId))
            return HtmlString.Empty;

        var classAttr = string.IsNullOrWhiteSpace(cssClass) ? "" : $" class=\"{cssClass}\"";
        return new HtmlString($"<svg{classAttr} aria-hidden=\"true\"><use href=\"{spritePath}#{symbolId}\"></use></svg>");
    }
}
